import { ImageResponse } from 'next/og';

export async function GET() {
  return new ImageResponse(
    <div style={{width:1200,height:630,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'64px 72px',background:'#ffffff',color:'#121416',fontFamily:'sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:18,letterSpacing:3,borderBottom:'1px solid #d9dddf',paddingBottom:24}}><span>KS / PORTFOLIO</span><span>SELECTED WORK</span></div>
      <div style={{display:'flex',flexDirection:'column'}}><strong style={{fontSize:88,letterSpacing:-5,lineHeight:1.05}}>Kevin Simatupang</strong><span style={{fontSize:42,marginTop:24,color:'#414a50'}}>Creative Programmer</span></div>
      <span style={{fontSize:18,color:'#555e65'}}>portfolio-kevins.vercel.app</span>
    </div>,
    {width:1200,height:630}
  );
}
