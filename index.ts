
import * as T from "@effect-ts/core/Effect"
import { pipe } from "@effect-ts/core/Function"
import { tag } from "@effect-ts/core/Has"

interface AddService {
  add: (n1: number, n2: number) => T.Effect<unknown, never, void>
}
interface SubtractService {
    subtract: (n1: number, n2: number) => T.Effect<unknown, never, void>
}
interface MultiplyService {
    multiply: (n1: number, n2: number) => T.Effect<unknown, never, void>
}

const AddService = tag<AddService>()
const SubtractService = tag<SubtractService>()
const MultiplyService = tag<MultiplyService>()

const add = (n1: number, n2: number) => T.accessServiceM(AddService)((_) => _.add(n1, n2))
const subtract = (n1: number, n2: number) => T.accessServiceM(SubtractService)((_) => _.subtract(n1, n2))
const multiply = (n1: number, n2: number) => T.accessServiceM(MultiplyService)((_) => _.multiply(n1, n2))

export function addition(n1: number, n2: number) {
  return add(n1, n2)
}
export function subtration(n1: number, n2: number) {
    return subtract(n1, n2)
}
export function multiplication(n1: number, n2: number) {
    return multiply(n1, n2)
}

const program = T.gen(function* (_) {
    yield* _(addition(6, 5))
    yield* _(subtration(6, 5))
    yield* _(multiplication(6, 5))
  })
  
pipe(program,
     T.provideService(AddService)({
        add: (n1, n2) =>
        T.succeedWith(() => {
            console.log(n1 + n2)
        })
    }),
    T.provideService(SubtractService)({
        subtract: (n1, n2) =>
        T.succeedWith(() => {
            console.log(n1 - n2)
        })
    }),
    T.provideService(MultiplyService)({
        multiply: (n1, n2) =>
        T.succeedWith(() => {
            console.log(n1 * n2)
        })
    }),
    T.runPromise
)