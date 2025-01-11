// types.ts
export type UpdateRecipeDataType = (key: string, value: any) => void;
export type UpdateBlogDataType = (key: string, value: any) => void;
export type updateState = (value: boolean) => void;
export type updatePercentage = (value: number) => void;
export type updateMsg= (value:string)=>void;
export type updateLink= (value:string)=>void;

export interface RecipeType {
    title: string;
    image: string;
    ingredients: { name: string; image: string }[];
    link: string;
  }
export type SignupDataType =(key: string, value: any) => void;
export type SearchupDataType =(key: string, value: any) => void;
export type RequestupDataType =(key: string, value: any) => void;
export type RatingsupDataType =(key: string, value: any) => void;
export type CommentsupDataType =(key: string, value: any) => void;

