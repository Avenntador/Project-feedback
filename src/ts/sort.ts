import { productRequests } from "./server-response-interface";



export function sortMostUpvotes(a: productRequests, b:productRequests):any {
    return b.upvotes - a.upvotes
}

export function sortLeastUpvotes(a: productRequests, b:productRequests):any {
    return a.upvotes - b.upvotes
}
export function sortMostComments(a: productRequests, b:productRequests):any {
    let aTotalComments = 0;
    let bTotalComments = 0;

    if (a.comments) {
        aTotalComments += a.comments.length;
        a.comments.forEach(item => {
            if (item.replies) {
                aTotalComments += item.replies.length;
            }
        });
    }
    if (b.comments) {
        bTotalComments += b.comments.length;
        b.comments.forEach(item => {
            if (item.replies) {
                bTotalComments += item.replies.length;
            }
        });
    }
    return bTotalComments - aTotalComments;
}
export function sortLeastComments(a: productRequests, b:productRequests):any {
    let aTotalComments = 0;
                let bTotalComments = 0;

                if (a.comments) {
                    aTotalComments += a.comments.length;
                    a.comments.forEach(item => {
                        if (item.replies) {
                            aTotalComments += item.replies.length;
                        }
                    });
                }
                if (b.comments) {
                    bTotalComments += b.comments.length;
                    b.comments.forEach(item => {
                        if (item.replies) {
                            bTotalComments += item.replies.length;
                        }
                    });
                }
                return aTotalComments - bTotalComments;
}