export type Method={title:string;steps:string[]};
export type ExamCase={id:string;lessonId:string;index:number;prompt:string;answer:number|string;ways:Method[];unit:string;options:(number|string)[];visual:null|{type:string;values:number[];labels:string[]}};
export type ExamLesson={id:string;title:string;area:string;topic:string;level:string;formula:string;idea:string;origin:string;condition:string;real:string;trap:string};
export type AttemptTiming={startedAt:number;lastAt:number;deadline:number;currentId:string|null;spent:Record<string,number>;answeredAt:Record<string,number>;endedAt:number|null};
