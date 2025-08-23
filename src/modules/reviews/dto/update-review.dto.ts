import { IsNumber, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateReviewRequest {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @IsNotEmpty()
    comment: string;
}