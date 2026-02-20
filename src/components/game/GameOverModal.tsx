"use client";

import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Trophy, RotateCcw } from "lucide-react";
import { SITE_URL } from "@/utils/constants";

interface GameOverModalProps {
  open: boolean;
  won: boolean;
  score: number;
  scoreLabel: string;
  onClose: () => void;
  onRestart: () => void;
  onSaveScore?: () => void;
  saving?: boolean;
  saved?: boolean;
  gameName?: string;
  gameSlug?: string;
}

export function GameOverModal({
  open,
  won,
  score,
  scoreLabel,
  onClose,
  onRestart,
  onSaveScore,
  saving,
  saved,
  gameName,
  gameSlug,
}: GameOverModalProps) {
  const { user } = useAuth();

  const shareText = gameName
    ? `${gameName} oyununda ${scoreLabel}: ${score}! bedava-oyun.com'da sen de oyna!`
    : `${scoreLabel}: ${score}! bedava-oyun.com'da ücretsiz oyna!`;
  const shareUrl = gameSlug ? `${SITE_URL}/oyunlar/${gameSlug}` : SITE_URL;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-4xl">{won ? "🎉" : "💥"}</div>
        <h2 className="text-2xl font-bold">
          {won ? "Tebrikler!" : "Oyun Bitti!"}
        </h2>
        <div className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>
            {scoreLabel}: <strong>{score}</strong>
          </span>
        </div>

        {/* Social Share */}
        <div className="flex items-center gap-2">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Paylaş
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </div>

        <div className="flex w-full flex-col gap-2">
          {user ? (
            onSaveScore && !saved ? (
              <Button onClick={onSaveScore} disabled={saving} className="w-full">
                {saving ? "Kaydediliyor..." : "Skoru Kaydet"}
              </Button>
            ) : saved ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                Skor kaydedildi!
              </p>
            ) : null
          ) : (
            <Link href="/giris" className="w-full">
              <Button className="w-full">
                Giriş Yap &amp; Skoru Kaydet
              </Button>
            </Link>
          )}
          <Button variant="secondary" onClick={onRestart} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Tekrar Oyna
          </Button>
        </div>
      </div>
    </Modal>
  );
}
