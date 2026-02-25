// src/features/tts/tts.ts
export function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(u);
}
