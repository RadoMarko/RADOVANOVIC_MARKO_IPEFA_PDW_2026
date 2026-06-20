import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Builder } from 'builder-pattern';
import { isNil } from 'lodash';
import { Repository } from 'typeorm';
import {
  Study,
  StudyCreatePayload,
  StudyStatus,
  StudyUpdatePayload,
} from '../model';
import {
  StudyCreateException,
  StudyDateRangeInvalidException,
  StudyDeleteException,
  StudyListException,
  StudyNameAlreadyExistsException,
  StudyNotFoundException,
  StudyUpdateException,
} from '../study.exception';

@Injectable()
export class StudyService {
  private readonly minimumStudyDate = '1950-01-01';
  private readonly logger = new Logger(StudyService.name);

  constructor(
    @InjectRepository(Study) private readonly repository: Repository<Study>,
  ) {}

  async create(payload: StudyCreatePayload): Promise<Study> {
    try {
      await this.ensureNameIsAvailable(payload.name);
      this.ensureDatesAreValid(payload.startDate, payload.endDate);

      const study = this.repository.create(
        Builder<Study>()
          .name(payload.name)
          .code(await this.generateNextCode())
          .description(payload.description)
          .startDate(payload.startDate)
          .endDate(payload.endDate)
          .status(payload.status ?? StudyStatus.DRAFT)
          .build(),
      );

      return await this.repository.save(study);
    } catch (e) {
      if (
        e instanceof StudyNameAlreadyExistsException ||
        e instanceof StudyDateRangeInvalidException
      ) {
        throw e;
      }

      this.logger.error((e as Error).message);
      throw new StudyCreateException();
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const study = await this.detail(id);
      await this.repository.remove(study);
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new StudyDeleteException();
    }
  }

  async detail(id: string): Promise<Study> {
    const result = await this.repository.findOneBy({ study_id: id });

    if (!isNil(result)) {
      return result;
    }

    throw new StudyNotFoundException();
  }

  async getAll(): Promise<Study[]> {
    try {
      return await this.repository
        .createQueryBuilder('study')
        .orderBy(
          "CASE WHEN study.code ~ '^[0-9]+$' THEN CAST(study.code AS INTEGER) ELSE 999999 END",
          'ASC',
        )
        .addOrderBy('study.code', 'ASC')
        .getMany();
    } catch (e) {
      this.logger.error((e as Error).message);
      throw new StudyListException();
    }
  }

  async update(payload: StudyUpdatePayload): Promise<Study> {
    try {
      const study = await this.detail(payload.study_id);

      if (!isNil(payload.name) && payload.name !== study.name) {
        await this.ensureNameIsAvailable(payload.name, study.study_id);
      }

      const startDate = this.hasPayloadValue(payload, 'startDate')
        ? payload.startDate
        : study.startDate;
      const endDate = this.hasPayloadValue(payload, 'endDate')
        ? payload.endDate
        : study.endDate;
      this.ensureDatesAreValid(startDate, endDate);

      study.name = payload.name ?? study.name;
      study.description = payload.description ?? study.description;
      study.startDate = startDate;
      study.endDate = endDate;
      study.status = payload.status ?? study.status;

      await this.repository.save(study);
      return this.detail(study.study_id);
    } catch (e) {
      if (
        e instanceof StudyNameAlreadyExistsException ||
        e instanceof StudyDateRangeInvalidException
      ) {
        throw e;
      }

      this.logger.error((e as Error).message);
      throw new StudyUpdateException();
    }
  }

  private async ensureNameIsAvailable(
    name: string,
    currentStudyId?: string,
  ): Promise<void> {
    const study = await this.repository.findOneBy({ name });
    if (!isNil(study) && study.study_id !== currentStudyId) {
      throw new StudyNameAlreadyExistsException();
    }
  }

  private ensureDatesAreValid(
    startDate?: Date | string | null,
    endDate?: Date | string | null,
  ): void {
    const start = this.toDateKey(startDate);
    const end = this.toDateKey(endDate);
    const today = this.toDateKey(new Date()) as string;

    if (
      (!isNil(start) && (start < this.minimumStudyDate || start > today)) ||
      (!isNil(end) && (isNil(start) || end < start || end > today))
    ) {
      throw new StudyDateRangeInvalidException();
    }
  }

  private toDateKey(value?: Date | string | null): string | null {
    if (isNil(value)) {
      return null;
    }

    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        return null;
      }

      return [
        value.getFullYear(),
        (value.getMonth() + 1).toString().padStart(2, '0'),
        value.getDate().toString().padStart(2, '0'),
      ].join('-');
    }

    return value.substring(0, 10);
  }

  private hasPayloadValue(
    payload: StudyUpdatePayload,
    key: keyof StudyUpdatePayload,
  ): boolean {
    return Object.prototype.hasOwnProperty.call(payload, key);
  }

  private async generateNextCode(): Promise<string> {
    const studies = await this.repository.find({
      select: {
        code: true,
      },
      order: {
        code: 'ASC',
      },
    });

    const usedCodes = new Set(
      studies
        .map((study) => Number.parseInt(study.code, 10))
        .filter((code) => Number.isInteger(code)),
    );
    for (let index = 1; index <= 9999; index++) {
      if (!usedCodes.has(index)) {
        return index.toString().padStart(4, '0');
      }
    }

    throw new StudyCreateException();
  }
}
