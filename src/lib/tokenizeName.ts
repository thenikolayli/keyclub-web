export default function tokenizeName(name: string): string[] {
  return name.trim().replaceAll(`"`, ``).toLowerCase().split(' ');
}
