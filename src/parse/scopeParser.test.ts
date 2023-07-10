import { extractScope, findScopeBegin, findScopeEnd } from "./scopeParser";

describe("findScopeEnd",()=>{
    test("simple",()=>{
        const input = "{hello world}";
        const closingIdx = findScopeEnd(input)
        expect(input[closingIdx]).toBe("}")
        expect(closingIdx).toBe(12)
    })
    test("multi bracket",()=>{
        const input = "{{{owo}}}";
        const closingIdx = findScopeEnd(input)
        expect(input[closingIdx]).toBe("}")
        expect(closingIdx).toBe(8)
        expect(input.substring(0,closingIdx+1)).toBe(input)
    })
    test("can handle whitespaces",()=>{
        const input = "{       {    {   owo    }    }    }";
        const closingIdx = findScopeEnd(input)
        expect(input[closingIdx]).toBe("}")
        expect(closingIdx).toBe(34)
        expect(input.substring(0,closingIdx+1)).toBe(input)
    })
    test("can handle sprinkeled scopes",()=>{
        const input = "{    {{ uwu }} {{}} [][[]]   {    {   owo    }    }    }";
        const closingIdx = findScopeEnd(input)
        expect(input[closingIdx]).toBe("}")
        expect(closingIdx).toBe(55)
        expect(input.substring(0,closingIdx+1)).toBe(input)
    })
    test("can handle sprinkeled scopes",()=>{
        const input = "{abcdef}ghi";
        const closingIdx = findScopeEnd(input)
        expect(input[closingIdx]).toBe("}")
        expect(input.substring(0,closingIdx+1)).toBe("{abcdef}")
    })
    test("-1 if no closing",()=>{
        const input = "{ab{}{}{{{}}}cdefghi";
        const closingIdx = findScopeEnd(input)
        expect(closingIdx).toBe(-1)
    })
})

describe("extractScope",()=>{
    test("simple",()=>{
        const input = "{abcdefg}"
        const {scope, remaining} = extractScope(input)
        expect(scope).toBe("{abcdefg}")
        expect(remaining).toBe("")
    })

    test("simple with rest",()=>{
        const input = "{abcdefg} hello world"
        const {scope, remaining} = extractScope(input)
        expect(scope).toBe("{abcdefg}")
        expect(remaining).toBe(" hello world")
    })

    test("nested scopes with rest",()=>{
        const input = "{a{{b{}{cde}f}}g} hello world"
        const {scope, remaining} = extractScope(input)
        expect(scope).toBe("{a{{b{}{cde}f}}g}")
        expect(remaining).toBe(" hello world")
    })

    test("fail on missing closing scope",()=>{
        const input = "{abcdefg hello world"
        const {scope, remaining} = extractScope(input)
        expect(scope).toBe(-1)
        expect(remaining).toBe(input)
    })

    test("fail on missing closing scope with nesting",()=>{
        const input = "{abc{}{}{{{{defg hello world"
        const {scope, remaining} = extractScope(input)
        expect(scope).toBe(-1)
        expect(remaining).toBe(input)
    })
})

describe("find scope begin",()=>{
    test("simple",()=>{
        const input = "{hello world}"
        const startIdx = findScopeBegin(input,/{/)
        expect(startIdx).toBe(0)
        expect(input[startIdx]).toBe("{")
    })

    test("simple with prefix",()=>{
        const input = "ongo bongo{hello world}"
        const startIdx = findScopeBegin(input,/{/)
        expect(startIdx).toBe(10)
        expect(input[startIdx]).toBe("{")
    })

    test("simple array with prefix",()=>{
        const input = "ongo bongo{[]hello world}"
        const startIdx = findScopeBegin(input,/\[/)
        expect(startIdx).toBe(11)
        expect(input[startIdx]).toBe("[")
    })
})