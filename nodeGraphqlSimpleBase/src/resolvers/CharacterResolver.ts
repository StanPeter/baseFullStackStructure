import Character from "../entity/Character";
import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class CharacterInputType {
    @Field()
    name: string;

    @Field(() => Int)
    health: number;

    @Field(() => Int)
    damage: number;

    @Field(() => [String])
    abilities: string[];
}

@InputType()
class CharacterInputTypeUpdate {
    @Field(() => String, { nullable: true })
    name?: string;

    @Field(() => Int, { nullable: true })
    health?: number;

    @Field(() => Int, { nullable: true })
    damage?: number;

    @Field(() => [String], { nullable: true })
    abilities?: string[];
}

@Resolver()
export class CharacterResolver {
    @Query(() => [Character])
    getCharacter() {
        return Character.find();
    }

    @Mutation(() => Boolean)
    async createCharacter(@Arg('newCharacter', () => CharacterInputType) newCharacter: CharacterInputType) {
        await Character.insert(newCharacter);
        return true;
    }

    @Mutation(() => Character)
    async updateCharacter(
        @Arg('characterId', () => Int) characterId: number,
        @Arg('updatedCharacter', () => CharacterInputTypeUpdate) updatedCharacter: CharacterInputTypeUpdate
    ) {
        await Character.update({ id: characterId }, updatedCharacter);
        const updatedChar = await Character.findOne({ id: characterId });
        return updatedChar;
    }

    @Mutation(() => Boolean)
    async deleteCharacter(@Arg('characterId', () => Int) characterId: number) {
        await Character.delete({ id: characterId });
        return true;
    }
}