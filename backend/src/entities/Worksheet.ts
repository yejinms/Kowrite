import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('worksheets')
export class Worksheet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 255 })
  topic: string;

  @Column({ type: 'varchar', length: 50 })
  difficulty: string;

  @Column({ type: 'varchar', length: 20 })
  language: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  grade?: string;

  @Column({ type: 'json' })
  content: {
    reading: string;
    vocabulary: Array<{
      word: string;
      definition: string;
      example: string;
    }>;
    questions: {
      main: string;
      extended: string;
      reflection: string;
    };
    discussion: string;
    summary: string;
  };

  @Column({ type: 'varchar', length: 50, default: 'draft' })
  status: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  downloadCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
