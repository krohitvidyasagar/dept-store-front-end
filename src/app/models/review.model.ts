export interface ProductReviewUser {
    first_name: string,
    last_name: string,
    middle_name: string
}

export interface ProductReview {
    user: ProductReviewUser,
    review: string,
    rating: number
}
  