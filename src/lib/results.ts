import {Result} from 'neverthrow';

export type UnResultOk<T> = T extends Result<infer Success, infer _Failure> ? Success : never;

export type UnResultErr<T> = T extends Result<infer _Success, infer Failure> ? Failure : never;
