import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

function clean(value: string | null, fallback: string, max: number) {
  return (value || fallback).replace(/[<>]/g, '').slice(0, max);
}

export async function GET(request: NextRequest) {
  const title = clean(request.nextUrl.searchParams.get('title'), 'Kevin Simatupang', 90);
  const label = clean(request.nextUrl.searchParams.get('label'), 'THE LIVING INDEX', 110);
  return new ImageResponse(
    <div style={{ width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '58px', color: '#eae9e4', background: '#0b0d0e', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', backgroundImage: 'linear-gradient(#202426 1px, transparent 1px), linear-gradient(90deg, #202426 1px, transparent 1px)', backgroundSize: '70px 70px', opacity: .55 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, letterSpacing: 3, color: '#c9cdd0', position: 'relative' }}><span>KS / THE LIVING INDEX</span><span>BALIKPAPAN, INDONESIA</span></div>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}><span style={{ color: '#ff663b', fontSize: 17, letterSpacing: 4, marginBottom: 24 }}>{label.toUpperCase()}</span><strong style={{ fontSize: title.length > 45 ? 72 : 96, lineHeight: .92, letterSpacing: -5, maxWidth: 1040 }}>{title}</strong></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}><span style={{ fontSize: 20, color: '#c9cdd0' }}>Web systems · operational data · interface design</span><span style={{ width: 18, height: 18, background: '#ff663b' }} /></div>
    </div>,
    { width: 1200, height: 630 }
  );
}
