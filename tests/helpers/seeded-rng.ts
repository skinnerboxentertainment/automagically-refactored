export function createSeededRNG(seed: number) {
  let s = seed | 0
  return {
    next(): number {
      s = (s * 16807 + 0) % 2147483647 | 0
      return (s - 1) / 2147483646
    },
    nextInt(min: number, max: number): number {
      return min + Math.floor(this.next() * (max - min + 1))
    },
  }
}
