import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("phrases")
export class Phrases extends BaseEntity {
    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column("text")
    phrase: string;

    @Field(() => Number)
    @Column("int", { default: 0 })
    streak: number;

    @Field(() => String)
    @Column("date", { default: new Date() })
    createdAt: Date;

    @Field(() => String)
    @Column("date", { default: new Date() })
    practisedAt: Date;

    @Field(() => String)
    translation: string
}
