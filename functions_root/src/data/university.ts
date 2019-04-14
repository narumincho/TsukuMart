import * as result from "./result";

/**
 * 学校での所属
 */
export type University
    = GraduateTsukuba
    | GraduateNotTsukuba
    | NotGraduate

const enum UniversityC {
    GraduateTsukuba,
    GraduateNotTsukuba,
    NotGraduate
}

interface GraduateTsukuba {
    c: UniversityC.GraduateTsukuba,
    graduate: Graduate,
    department: Department
}

interface GraduateNotTsukuba {
    c: UniversityC.GraduateNotTsukuba,
    graduate: Graduate
}

interface NotGraduate {
    c: UniversityC.NotGraduate,
    department: Department
}

export const toSimpleObject = (university: University): { graduate?: Graduate, department?: Department } => {
    switch (university.c) {
        case UniversityC.GraduateTsukuba:
            return {
                graduate: university.graduate,
                department: university.department
            }
        case UniversityC.GraduateNotTsukuba:
            return {
                graduate: university.graduate
            }
        case UniversityC.NotGraduate:
            return {
                department: university.department
            }
    }
}

export const enum Error {
    NeedUniversityField,
    UniversityFieldMustBeObject,
    NeedGraduateFieldOrDepartmentField,
    GraduateFieldOrDepartmentFieldError
}

export const errorToString = (error: Error): string => {
    switch (error) {
        case Error.NeedUniversityField:
            return "need university field"
        case Error.UniversityFieldMustBeObject:
            return "university field must be object"
        case Error.NeedGraduateFieldOrDepartmentField:
            return `need graduate field or department field`;
        case Error.GraduateFieldOrDepartmentFieldError:
            return "university code error";
    }
}


export const getValidUniversity = (o: object): result.Result<University, Error> => {
    if (!o.hasOwnProperty("university")) {
        return result.err(Error.NeedUniversityField);
    }
    const university: unknown = (o as { university: unknown }).university;
    if (typeof university !== "object" || university === null) {
        return result.err(Error.UniversityFieldMustBeObject);
    }

    if ((!o.hasOwnProperty("graduate")) && (!o.hasOwnProperty("department"))) {
        return result.err(Error.NeedGraduateFieldOrDepartmentField);
    }
    const graduate: Graduate | null = toValidGraduate((o as { graduate: unknown }).graduate);
    const department: Department | null = toValidDepartment((o as { department: unknown }).department);
    if (graduate !== null && department !== null) {
        return result.ok({
            c: UniversityC.GraduateTsukuba,
            graduate: graduate,
            department: department
        })
    }
    if (graduate !== null) {
        return result.ok({
            c: UniversityC.GraduateNotTsukuba,
            graduate: graduate
        })
    }
    if (department !== null) {
        return result.ok({
            c: UniversityC.NotGraduate,
            department: department
        })
    }
    return result.err(Error.GraduateFieldOrDepartmentFieldError);
}

type Department =
    "humanity" |
    "culture" |
    "japanese" |
    "social" |
    "cis" |
    "education" |
    "psyche" |
    "disability" |
    "biol" |
    "bres" |
    "earth" |
    "math" |
    "phys" |
    "chem" |
    "coens" |
    "esys" |
    "pandps" |
    "coins" |
    "mast" |
    "klis" |
    "med" |
    "nurse" |
    "ms" |
    "aandd" |
    "sport"

const toValidDepartment = (department: unknown): Department | null => {
    switch (department) {
        case "humanity":
        case "humanity":
        case "culture":
        case "japanese":
        case "social":
        case "cis":
        case "education":
        case "psyche":
        case "disability":
        case "biol":
        case "bres":
        case "earth":
        case "math":
        case "phys":
        case "chem":
        case "coens":
        case "esys":
        case "pandps":
        case "coins":
        case "mast":
        case "klis":
        case "med":
        case "nurse":
        case "ms":
        case "aandd":
        case "sport":
            return department;
    }
    return null;
}

type Graduate =
    "education" |
    "hass" |
    "gabs" |
    "pas" |
    "sie" |
    "life" |
    "chs" |
    "slis" |
    "global"

const toValidGraduate = (graduate: unknown): Graduate | null => {
    switch (graduate) {
        case "education":
        case "hass":
        case "gabs":
        case "pas":
        case "sie":
        case "life":
        case "chs":
        case "slis":
        case "global":
            return graduate;
    }
    return null;
}
