"use client";

import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Trophy, RotateCcw } from "lucide-react";

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
}: GameOverModalProps) {
  const { user } = useAuth();

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
