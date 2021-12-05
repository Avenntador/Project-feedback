import { sortMostUpvotes } from './sort';
import { sortLeastUpvotes } from './sort';
import { sortMostComments } from './sort';
import { sortLeastComments } from './sort';
import { productRequests } from '../interfaces/server-response-interface';


let sortFunctions: any = {
    "Most upvotes": sortMostUpvotes,
    "Least upvotes": sortLeastUpvotes,
    "Most comments": sortMostComments,
    "Least comments": sortLeastComments
}

export function getSortedResponse(sortOrder: string, Response: productRequests[]): productRequests[] {
    let sortFunction: any;

    for (let key in sortFunctions) {
        if (sortOrder == key) {
            sortFunction = sortFunctions[key];
        }
    }

    return Response.sort(sortFunction);
}