export type QueryCondition = {
  column: string;
  operator: string;
  variable: any;
};

export type WhereClause = {
  clause: string;
  varArray: any[] | undefined;
};

export function buildWhereClause(conditions: QueryCondition[]): WhereClause {
  const varArray = [];
  let index = 0;
  let str = "";
  for (const condition of conditions) {
    index++;
    str += index === 1 ? "WHERE " : " AND ";
    str += ` ${condition.column} ${condition.operator} $${index} `;
    varArray.push(condition.variable);
  }
  return {
    clause: str,
    varArray: varArray.length === 0 ? undefined : varArray,
  };
}
