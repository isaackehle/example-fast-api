type AmountType = {
  CREDIT: "CREDIT";
  DEBIT: "DEBIT";
};

type Status = {
  POSITIVE: "POSITIVE";
  NEGATIVE: "NEGATIVE";
  ZERO: "ZERO";
};

const get_status = (val: number) => {
  if (val > 0) {
    return "POSITIVE";
  }
  if (val < 0) {
    return "NEGATIVE";
  }
  return "ZERO";
};

function simple_list_parser(list: string[]) {

  const convert_string = (x: string) => x.split("|");

  const summary_object = list.reduce(
    (acc, str) => {
      const data = convert_string(str);
      const [user_id, type, amount] = data;

      if (acc[user_id] == null) {
        acc[user_id] = 0;
      }

      if (type == "CREDIT") {
        acc[user_id] += parseFloat(amount);
      } else {
        acc[user_id] -= parseFloat(amount);
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const keys = Object.keys(summary_object).sort();

  const result: string[] = [];

  for (const user_id of keys) {
    const balance = summary_object[user_id];
    const line = `${user_id}: balance: ${balance}, status: ${get_status(balance)}`;
    result.push(line);
  }

  return result;
}

const input = [
  "alice|CREDIT|200",
  "carol|CREDIT|75",
  "alice|DEBIT|50",
  "bob|DEBIT|100",
  "carol|DEBIT|75",
];

const output = simple_list_parser(input);

console.log(output.join('\n'));
