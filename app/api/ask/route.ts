import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY が未設定です（.env.local を確認）" },
        { status: 500 }
      );
    }

    // あなたの ListModels 結果にあるモデルを使う
    const model = "gemini-2.0-flash-lite"; // 例: "gemini-2.5-flash" でもOK
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }],
      }),
    });

    const data = await response.json();

    // ここが重要：APIがエラーを返したら理由を返す
    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Gemini API エラー",
          status: response.status,
          details: data,
        },
        { status: response.status }
      );
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "回答を取得できませんでした";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "サーバー側例外" }, { status: 500 });
  }
}
