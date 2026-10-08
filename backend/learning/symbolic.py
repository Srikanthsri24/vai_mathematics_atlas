"""Parse a small mathematical grammar without evaluating source strings."""
import ast
import re
import sympy as sp
x = sp.Symbol('x', real=True)
symbols = {'x': x, 'a': sp.Symbol('a', real=True), 'b': sp.Symbol('b', real=True), 'c': sp.Symbol('c', real=True), 'pi': sp.pi, 'e': sp.E}
functions = {'sin': sp.sin, 'cos': sp.cos, 'tan': sp.tan, 'sqrt': sp.sqrt, 'log': sp.log, 'exp': sp.exp, 'abs': sp.Abs}

def parse_expression(source, answer=False):
    if not isinstance(source, str) or len(source) > 160:
        raise ValueError('Use a mathematical expression of at most 160 characters.')
    source = source.replace('π', 'pi').replace('^', '**')
    source = re.sub(r'(?<=[0-9)])(?=pi)', '*', source)
    try:
        tree = ast.parse(source, mode='eval')
    except (SyntaxError, RecursionError):
        raise ValueError('Invalid expression.')
    nodes = list(ast.walk(tree))
    if len(nodes) > 80:
        raise ValueError('Expression is too complex.')
    def visit(n, depth=0):
        result = walk(n, depth)
        if result.count_ops() > 100 or any(abs(power.exp) > 100 for power in result.atoms(sp.Pow) if power.exp.is_number):
            raise ValueError('Expression exceeds the symbolic complexity limit.')
        if result.is_Rational and (int(result.p).bit_length() > 4096 or int(result.q).bit_length() > 4096):
            raise ValueError('Exact number is too large.')
        return result
    def walk(n, depth=0):
        if depth > 20:
            raise ValueError('Expression is too deeply nested.')
        if isinstance(n, ast.Constant) and type(n.value) in (int, float):
            text = ast.get_source_segment(source, n)
            if len(text) > 30:
                raise ValueError('Number is too large.')
            value = sp.Rational(text)
            if abs(value) > 10**12:
                raise ValueError('Number is outside the supported range.')
            return value
        if isinstance(n, ast.Name) and n.id in symbols:
            if answer and n.id not in ('pi',):
                raise ValueError('Answers may contain rational numbers and pi only.')
            return symbols[n.id]
        if isinstance(n, ast.UnaryOp) and isinstance(n.op, (ast.UAdd, ast.USub)):
            value = visit(n.operand, depth+1)
            return value if isinstance(n.op, ast.UAdd) else -value
        if isinstance(n, ast.BinOp) and isinstance(n.op, (ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Pow)):
            left, right = visit(n.left, depth+1), visit(n.right, depth+1)
            if isinstance(n.op, ast.Add): return left + right
            if isinstance(n.op, ast.Sub): return left - right
            if isinstance(n.op, ast.Mult): return left * right
            if isinstance(n.op, ast.Div):
                if right == 0: raise ValueError('Division by zero.')
                return left / right
            if not right.is_Integer or abs(right) > 10:
                raise ValueError('Use integer exponents between −10 and 10.')
            if left.is_number and left.is_Rational and abs(left) > 10**12:
                raise ValueError('Power base is too large.')
            if left == 0 and right < 0: raise ValueError('Division by zero.')
            return left**right
        if not answer and isinstance(n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in functions and len(n.args) == 1 and not n.keywords:
            return functions[n.func.id](visit(n.args[0], depth+1))
        raise ValueError('Unsupported notation. Attributes, code and unknown names are rejected.')
    result = visit(tree.body)
    if result.has(sp.zoo, sp.oo, -sp.oo, sp.nan):
        raise ValueError('Expression is undefined.')
    return result

ANSWERS = {'area-three': '9*pi', 'diameter-ten': '25*pi', 'scale': '9', 'ring': '16*pi', 'error': '8*pi', 'zero': '0'}
MISCONCEPTIONS = {'area-three': 'Square the radius and distinguish area from circumference.', 'diameter-ten': 'Halve diameter before squaring.', 'scale': 'Area scales with length squared.', 'ring': 'Subtract disk areas, not radii.', 'error': 'Check radius, dimensions and the reported quantity.', 'zero': 'A zero-radius disk has zero area.'}
def grade(concept, question, response):
    if concept != 'circle-area' or question not in ANSWERS:
        raise ValueError('This question is not in the server-reviewed assessment bank.')
    try:
        return sp.expand(parse_expression(response, answer=True) - parse_expression(ANSWERS[question], answer=True)) == 0
    except ValueError:
        return False
