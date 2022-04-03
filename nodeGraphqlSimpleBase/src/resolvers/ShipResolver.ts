import Ship from "../entity/Ship";
import { Arg, Field, InputType, Int, Mutation, Query, Resolver } from "type-graphql";

@InputType()
class ShipInput {
    @Field()
    health: string;

    @Field(() => Int)
    damage: number;
}

@InputType()
class UpdateShipInput {
    @Field(() => String, { nullable: true })
    health?: string;

    @Field(() => Int, { nullable: true })
    damage?: number;
}

@Resolver()
export class ShipResolver {
    @Mutation(() => String)
    async createShip(@Arg('options', () => ShipInput) options: ShipInput) {
        // const ship = await Ship.create(options).save(); //this would basically return the ship but also needs to be specified in the mutation what to return
        // return ship;
        await Ship.insert(options);

        return 'created correctly';
    }

    @Mutation(() => Boolean)
    async updateShip(
        @Arg('id', () => Int) id: number,
        @Arg('input', () => UpdateShipInput) input: UpdateShipInput
    ) {
        await Ship.update({ id }, input);
        return true;
    }

    @Mutation(() => Boolean)
    async deleteShip(@Arg('id', () => Int) id: number) {
        await Ship.delete({ id });
        return true;
    }

    @Query(() => [Ship])
    getShips() {
        return Ship.find();
    }
}