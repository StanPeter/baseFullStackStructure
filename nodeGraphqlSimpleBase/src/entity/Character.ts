import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

// type Character {
//     id: ID!
//     name: String!
//     health: Number
//     damage: Number
//     abilities: [String!]!
//     creationDate: Date!
// }

@ObjectType()
@Entity()
export default class Character extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    name: string;

    @Field(() => Int)
    @Column('int', { default: 100 })
    health: number;

    @Field(() => Int)
    @Column('int', { nullable: true, default: 20 })
    damage: number;

    @Field(() => [String])
    @Column('simple-array')
    abilities: string[];

    @Field(() => String)
    @CreateDateColumn()
    creationDate: Date;
}