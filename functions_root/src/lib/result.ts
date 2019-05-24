/**
 * Elmである、成功した結果か失敗したときのエラーの情報を保持する型
 */
export type Result<Ok, Err> = { c: ResultC.Ok, v: Ok } | { c: ResultC.Err, v: Err }

const enum ResultC {
    Ok, Err
}

export const ok: <ok>(v: ok) => Result<ok, never> = v => ({ c: ResultC.Ok, v: v });
export const err: <err>(v: err) => Result<never, err> = v => ({ c: ResultC.Err, v: v });

/**
 * 成功したときと失敗したときで分岐して処理する
 * @param result 
 * @param okBranch 成功したときにどうするか
 * @param errBranch 失敗したときにどうするか
 */
export const match: <ok, err, v>(result: Result<ok, err>, okBranch: (_: ok) => v, errBranch: (_: err) => v) => v = (result, okBranch, errBranch) => {
    switch (result.c) {
        case ResultC.Ok:
            return okBranch(result.v);
        case ResultC.Err:
            return errBranch(result.v);
    }
}
