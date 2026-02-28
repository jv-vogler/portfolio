// CSS module declarations for tsgo compatibility
// tsgo does not resolve CSS side-effect imports via Next.js type references
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
