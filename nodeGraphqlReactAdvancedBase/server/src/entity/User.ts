import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType() //makes available to be used as an object type for resolvers
@Entity("users") //entity is a table inside the db, (nameOfTable)
export class User extends BaseEntity {
    //base entity comes with methods to for example save the data
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column("text")
    email: string;

    @Field()
    @Column("text", { nullable: true })
    firstName: string;

    @Field()
    @Column("text", { nullable: true })
    lastName: string;

    @Field(() => Boolean)
    @Column("bool", { default: false, nullable: true })
    receivePromo: boolean;

    @Column("text") //don't wanna expose this inside Field
    password: string;

    @Column("int", { default: 0 }) //used for revoking the user's tokens
    tokenVersion: number;
}
