export function indent(s: string, spacer: string, amount: number): string {
  return (
    s
      .replace(/\r\n$/, "")
      .replace(/\r\n/g, "\r\n" + spacer.repeat(amount))
      .replace(/^/, spacer.repeat(amount)) + "\r\n"
  );
}
