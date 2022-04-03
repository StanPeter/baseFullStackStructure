import { gql } from "@apollo/client";
//writing of queries before generating them through another library

export const RANDOM = gql`
    {
        tryingOut {
            id
            email
        }
    }
`;
