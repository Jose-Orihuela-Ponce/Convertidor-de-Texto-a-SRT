'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SRTConverter() {
  const [inputText, setInputText] = useState('');
  const [wordsPerSecond, setWordsPerSecond] = useState(3);
  const [subtitleDuration, setSubtitleDuration] = useState(0.95);

  const convertToSRT = (text: string) => {
    const words = text.split(' ');
    const subtitles = [];
    let currentSubtitle = [];
    let wordCount = 0;
    let subtitleNumber = 1;
    let currentTime = 0.0;

    const wordsPerSubtitle = subtitleDuration * wordsPerSecond;

    for (const word of words) {
      currentSubtitle.push(word);
      wordCount++;

      if (wordCount >= wordsPerSubtitle) {
        const startTime = currentTime;
        const endTime = currentTime + subtitleDuration;

        const startTimeMs = Math.floor((startTime % 1) * 1000);
        const endTimeMs = Math.floor((endTime % 1) * 1000);

        const startTimeSec = Math.floor(startTime);
        const endTimeSec = Math.floor(endTime);

        const formattedStartTime = `00:00:${String(startTimeSec).padStart(
          2,
          '0'
        )},${String(startTimeMs).padStart(3, '0')}`;
        const formattedEndTime = `00:00:${String(endTimeSec).padStart(
          2,
          '0'
        )},${String(endTimeMs).padStart(3, '0')}`;

        subtitles.push(
          `${subtitleNumber}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSubtitle.join(
            ' '
          )}\n`
        );

        currentSubtitle = [];
        wordCount = 0;
        subtitleNumber++;
        currentTime += subtitleDuration;
      }
    }

    if (currentSubtitle.length > 0) {
      const startTime = currentTime;
      const endTime = currentTime + subtitleDuration;

      const startTimeMs = Math.floor((startTime % 1) * 1000);
      const endTimeMs = Math.floor((endTime % 1) * 1000);

      const startTimeSec = Math.floor(startTime);
      const endTimeSec = Math.floor(endTime);

      const formattedStartTime = `00:00:${String(startTimeSec).padStart(
        2,
        '0'
      )},${String(startTimeMs).padStart(3, '0')}`;
      const formattedEndTime = `00:00:${String(endTimeSec).padStart(
        2,
        '0'
      )},${String(endTimeMs).padStart(3, '0')}`;

      subtitles.push(
        `${subtitleNumber}\n${formattedStartTime} --> ${formattedEndTime}\n${currentSubtitle.join(
          ' '
        )}\n`
      );
    }

    return subtitles.join('\n');
  };

  const handleConvert = () => {
    if (!inputText.trim()) return;

    const srtContent = convertToSRT(inputText);

    // Crear el archivo SRT
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Crear un elemento <a> temporal para la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subtitles.srt';
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleWordsPerSecondChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseFloat(e.target.value);
    if (value > 0) {
      setWordsPerSecond(value);
    }
  };

  const handleSubtitleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number.parseFloat(e.target.value);
    if (value > 0) {
      setSubtitleDuration(value);
    }
  };

  return (
    <div className="min-h-screen dark bg-background pt-12">
      <div className="container mx-auto p-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Convertidor de Texto a SRT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wps">Palabras por segundo</Label>
                <Input
                  id="wps"
                  type="number"
                  value={wordsPerSecond}
                  onChange={handleWordsPerSecondChange}
                  step="0.1"
                  min="0.1"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración del subtítulo (s)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={subtitleDuration}
                  onChange={handleSubtitleDurationChange}
                  step="0.05"
                  min="0.1"
                  className="w-full"
                />
              </div>
            </div>
            <Textarea
              placeholder="Ingresa el texto a convertir..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px]"
            />
            <Button
              onClick={handleConvert}
              className="w-full"
              disabled={!inputText.trim()}
            >
              Convertir y Descargar SRT
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
