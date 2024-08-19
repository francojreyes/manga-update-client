/**
 * Get the date the object identified by snowflake was created
 */
export default function snowflakeCreatedAt(snowflake: string): Date {
  const asInt = BigInt(snowflake);
  return new Date(Number((asInt >> BigInt(22)) + BigInt(1420070400000)));
}