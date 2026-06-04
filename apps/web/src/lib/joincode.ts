import { prisma } from "./prisma";

// No ambiguous chars (0/O, 1/I) so codes are easy to read aloud / type.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function random(len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export async function generateJoinCode(len = 5): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt++) {
    const code = random(len);
    const clash = await prisma.quiz.findUnique({ where: { joinCode: code } });
    if (!clash) return code;
  }
  return random(len + 1);
}
