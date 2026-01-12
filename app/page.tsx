'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Coins, 
  Leaf, 
  Truck, 
  Baby, 
  Train, 
  Sun, 
  Thermometer, 
  Battery, 
  X, 
  CheckCircle2,
  Hand
} from 'lucide-react';

// -----------------------------------------------------------------------------
// データ定義
// -----------------------------------------------------------------------------

type Subsidy = {
  id: string;
  title: string;
  limit: string;
  icon: React.ReactNode;
  shortDesc: string;
  description: string;
  target: string;
  merit: string;
  category: 'new_reform' | 'child_move' | 'energy_zeh';
  benefitType: 'initial_cost' | 'long_term' | 'local_eco';
};

const subsidies: Subsidy[] = [
  // --- 新築・リフォーム ---
  {
    id: 'mortgage-tax',
    title: '住宅ローン\n減税',
    limit: '最大455万円',
    icon: <Coins className="text-slate-700 w-full h-full" />,
    shortDesc: '所得税などを控除',
    description: '年末の住宅ローン残高に応じて、所得税や住民税から一定額が控除される制度です。13年間にわたり税金の還付が受けられるため、実質的な金利負担を軽減できます。',
    target: '住宅ローンを利用してマイホームを新築・取得・リフォームする方',
    merit: '長期にわたり税負担が軽くなり、手元の現金を残しやすくなります。',
    category: 'new_reform',
    benefitType: 'initial_cost'
  },
  {
    id: 'kids-eco',
    title: 'こどもエコ\nすまい(全国)',
    limit: '100万円',
    icon: <Home className="text-slate-700 w-full h-full" />,
    shortDesc: '省エネ住宅への支援',
    description: '子育て世帯や若者夫婦世帯が、高い省エネ性能（ZEHレベル）を持つ住宅を新築する場合に補助金が支給されます。国の事業であり、予算上限に達し次第終了となるため早めの申請が重要です。',
    target: '18歳未満の子がいる世帯、または夫婦どちらかが39歳以下の世帯',
    merit: '高性能な家をお得に建てられ、光熱費の削減にもつながります。',
    category: 'new_reform',
    benefitType: 'long_term'
  },
  {
    id: 'prefecture-wood',
    title: '県産材利用\n補助',
    limit: '30万円',
    icon: <Leaf className="text-slate-700 w-full h-full" />,
    shortDesc: '地元の木材を使用',
    description: '栃木県内で生産された木材（県産材）を一定量以上使用して家を建てる場合に助成されます。地産地消を促進し、地元の林業を応援する制度です。',
    target: '栃木県産材を指定の割合以上使用して木造住宅を新築する方',
    merit: '木の香りがする温かみのある家づくりができ、地域の環境保全にも貢献できます。',
    category: 'new_reform',
    benefitType: 'local_eco'
  },

  // --- 子育て・移住 ---
  {
    id: 'migration-support',
    title: '移住支援金',
    limit: '100万円',
    icon: <Truck className="text-slate-700 w-full h-full" />,
    shortDesc: '東京圏からの移住',
    description: '東京23区（在住または通勤者）から栃木県内の対象市町村へ移住し、就業・起業などをされる方に支給されます。単身の場合は60万円、世帯の場合は100万円が基本となります。',
    target: '東京圏から栃木県に移住し、就業・起業・テレワーク等を行う方',
    merit: '引越し費用や新生活のセットアップにかかる初期費用を大幅にカバーできます。',
    category: 'child_move',
    benefitType: 'initial_cost'
  },
  {
    id: 'child-support',
    title: '子育て世帯\n補助',
    limit: '50万円',
    icon: <Baby className="text-slate-700 w-full h-full" />,
    shortDesc: '自治体独自の支援',
    description: '各市町村が独自に行っている、子育て世帯向けの住宅取得補助金です。「三世代同居」や「近居」を条件とする場合や、お子様の人数に応じて加算される場合があります。',
    target: '中学生以下のお子様がいる世帯や、これから出産予定の世帯など',
    merit: '自治体によって手厚いサポートがあり、地域での生活基盤を整えやすくなります。',
    category: 'child_move',
    benefitType: 'long_term'
  },
  {
    id: 'commuting',
    title: '通勤補助',
    limit: '月1万円',
    icon: <Train className="text-slate-700 w-full h-full" />,
    shortDesc: '新幹線等の通勤費',
    description: '県外の職場へ新幹線や特急列車を利用して通勤する場合、その定期代の一部を補助する制度です。遠距離通勤でも快適な栃木ライフとの両立を支援します。',
    target: '栃木県内に定住し、県外へ鉄道で通勤する方（年齢制限などがある場合あり）',
    merit: '都心で働きながら、住環境の良い栃木県で暮らすハイブリッドな生活を経済的にサポートします。',
    category: 'child_move',
    benefitType: 'local_eco'
  },

  // --- 省エネ・ZEH ---
  {
    id: 'zeh',
    title: 'ZEH補助金',
    limit: '100万円',
    icon: <Sun className="text-slate-700 w-full h-full" />,
    shortDesc: 'エネを創る家',
    description: '「断熱」「省エネ」「創エネ」を組み合わせて、年間のエネルギー消費量の収支をゼロにすることを目指した住宅（ZEH）に対する国の補助金です。',
    target: 'ZEH（ネット・ゼロ・エネルギー・ハウス）の基準を満たす住宅を新築・購入する方',
    merit: '補助金だけでなく、入居後の光熱費が大幅に下がるため、経済的メリットが非常に大きいです。',
    category: 'energy_zeh',
    benefitType: 'initial_cost'
  },
  {
    id: 'insulation',
    title: '断熱\nリフォーム',
    limit: '200万円',
    icon: <Thermometer className="text-slate-700 w-full h-full" />,
    shortDesc: '窓や壁の断熱化',
    description: '既存住宅の窓を二重サッシにしたり、壁や床に断熱材を入れるリフォーム工事に対する補助です。家の中の温度差を減らし、ヒートショックなどを防ぎます。',
    target: '今の住まいをより快適・健康的にリフォームしたい方',
    merit: '冬暖かく夏涼しい快適な住環境が手に入り、冷暖房効率もアップします。',
    category: 'energy_zeh',
    benefitType: 'long_term'
  },
  {
    id: 'solar-battery',
    title: '太陽光・\n蓄電池',
    limit: '100万円',
    icon: <Battery className="text-slate-700 w-full h-full" />,
    shortDesc: '自家発電と備蓄',
    description: '太陽光発電システムや定置用リチウムイオン蓄電池を導入する際の費用を補助します。災害時の非常用電源としても活用できるため、防災対策としても注目されています。',
    target: '自宅に再エネ設備を導入し、エネルギーの自給自足を目指す方',
    merit: '電気代の高騰対策になり、停電時でも電気が使える安心感が得られます。',
    category: 'energy_zeh',
    benefitType: 'local_eco'
  }
];

const categoryLabels = {
  new_reform: { label: '新築・\nリフォーム', icon: <Home className="text-orange-600 w-full h-full" /> },
  child_move: { label: '子育て・\n移住', icon: <Baby className="text-orange-600 w-full h-full" /> },
  energy_zeh: { label: '省エネ・\nZEH', icon: <Sun className="text-orange-600 w-full h-full" /> }
};

const benefitLabels = {
  initial_cost: { label: '初期費用を\n抑えたい' },
  long_term: { label: '長期的な\n安心' },
  local_eco: { label: '地域貢献・\nエコ' }
};

// -----------------------------------------------------------------------------
// コンポーネント
// -----------------------------------------------------------------------------

export default function SubsidyMap() {
  const [selectedSubsidy, setSelectedSubsidy] = useState<Subsidy | null>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-12 selection:bg-green-200">
      {/* ヘッダーエリア：背景色を統一 */}
      <div className="relative bg-white pt-8 pb-10 md:pt-8 md:pb-16 px-4 text-center overflow-hidden shrink-0">
        {/* 背景装飾（雲） */}
        <div className="absolute top-6 left-[5%] w-12 h-6 md:w-20 md:h-10 bg-white/60 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-10 right-[10%] w-20 h-10 md:w-28 md:h-14 bg-white/70 rounded-full blur-xl"></div>

        {/* タイトル */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-xl md:text-3xl font-extrabold text-green-700 mb-2 drop-shadow-sm tracking-widest border-b-2 border-green-700/30 inline-block pb-1">
            栃木県で家を建てる！
          </h2>
          <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight drop-shadow-md mt-1 leading-tight">
            100万円得する <br /> 補助金マップ
          </h1>

          {/* CTA: 行動を促すメッセージ */}
          <div className="mt-4 md:mt-6">
            <p className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl text-green-800 font-bold text-sm md:text-base shadow-sm border border-green-200">
              <Hand size={20} className="shrink-0 animate-pulse text-green-600" />
              <span className="text-center md:text-left leading-tight">
                気になる補助金をタップして <br className="md:hidden" />
                <span className="hidden md:inline">、</span>
                詳細をチェックしよう
              </span>
            </p>
          </div>
        </div>

        {/* 背景装飾（遠くの山並みイメージ） */}
        <div className="absolute bottom-0 left-0 right-0 h-10 md:h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-0"></div>
      </div>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-1 md:px-4 -mt-4 md:-mt-6 relative z-20">
        {/* 全デバイス共通：画面幅にフィットするテーブル */}
        <div className="w-full">
          <div className="w-full bg-[#8FCF9D] p-[2px] md:p-[3px] rounded-lg md:rounded-xl shadow-xl border border-[#7dbd8b]">
            {/* グリッドレイアウト：スマホ(幅極小) -> PC(幅広) */}
            <div className="grid grid-cols-[45px_1fr_1fr_1fr] md:grid-cols-[110px_1fr_1fr_1fr] gap-[1px] md:gap-[2px] rounded-md md:rounded-lg overflow-hidden bg-[#8FCF9D]">

              {/* --- 1行目: ヘッダー行 --- */}
              {/* 左上セル */}
              <div className="bg-[#E8F5E9] p-1 flex items-center justify-center font-bold text-[10px] md:text-lg text-slate-800 text-center leading-tight">
                目的<br className="md:hidden" />規模
              </div>

              {/* 列ヘッダー */}
              {Object.entries(benefitLabels).map(([key, info]) => (
                <div key={key} className="bg-[#E8F5E9] py-2 px-0.5 md:py-3 md:px-1 flex items-center justify-center text-center h-full">
                  <div className="font-bold text-[11px] md:text-lg text-slate-900 whitespace-pre-line leading-tight">
                    {info.label}
                  </div>
                </div>
              ))}

              {/* --- データ行 --- */}
              {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((catKey) => (
                <React.Fragment key={catKey}>
                  {/* 行ヘッダー (左側) */}
                  <div className="bg-[#E8F5E9] py-2 px-0.5 md:py-4 md:px-1 flex flex-col items-center justify-center text-center font-bold text-slate-800 border-t border-[#8FCF9D]/30">
                    <div className="mb-1 md:mb-2 bg-white/60 p-1 md:p-1.5 rounded-full shadow-sm w-6 h-6 md:w-12 md:h-12 flex items-center justify-center">
                      {categoryLabels[catKey].icon}
                    </div>
                    <div className="text-[9px] md:text-lg leading-tight md:leading-snug whitespace-pre-line">
                      {categoryLabels[catKey].label}
                    </div>
                  </div>

                  {/* カードセル */}
                  {(['initial_cost', 'long_term', 'local_eco'] as const).map((benefitKey) => {
                    const subsidy = subsidies.find(
                      s => s.category === catKey && s.benefitType === benefitKey
                    );
                    return (
                      <div key={benefitKey} className="bg-white p-[1px] md:p-2 flex flex-col h-full items-center justify-center relative">
                        {subsidy ? (
                          <button
                            onClick={() => setSelectedSubsidy(subsidy)}
                            className="w-full h-full min-h-[90px] md:min-h-[160px] bg-[#BBE3F5] hover:bg-[#A8DDF2] rounded-md md:rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-1 md:p-2 flex flex-col items-center text-center group relative overflow-hidden active:scale-95"
                          >
                            {/* アイコン */}
                            <div className="mt-1 mb-1 md:mt-2 md:mb-2 relative z-10 w-5 h-5 md:w-8 md:h-8">
                              {subsidy.icon}
                            </div>

                            {/* タイトル */}
                            <h3 className="font-bold text-slate-900 text-[11px] md:text-[17px] leading-snug mb-auto flex items-center justify-center w-full px-1 py-0.5 whitespace-pre-line relative z-10 tracking-tight">
                              {subsidy.title}
                            </h3>

                            {/* 上限額エリア */}
                            <div className="w-full mt-1 md:mt-2 relative z-10">
                              <div className="hidden md:block text-[8px] md:text-[10px] text-slate-600 font-bold mb-0.5 transform scale-95 md:scale-100 origin-center whitespace-nowrap">上限額：</div>
                              <div className="bg-white/90 rounded-sm md:rounded-md py-0.5 px-0.5 md:py-1 md:px-1 shadow-sm">
                                <div className="text-xs md:text-lg font-extrabold text-slate-900 leading-none whitespace-normal break-words md:whitespace-nowrap">
                                  {subsidy.limit}
                                </div>
                              </div>
                            </div>

                            {/* クリック領域のハイライト用 */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors pointer-events-none"></div>
                          </button>
                        ) : (
                          <div className="w-full h-full min-h-[90px] md:min-h-[160px] bg-slate-50 rounded-md md:rounded-xl flex items-center justify-center text-slate-300">
                            -
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 詳細モーダル */}
      {selectedSubsidy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedSubsidy(null)}
          />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 border-4 border-[#8FCF9D]">
            {/* モーダルヘッダー */}
            <div className="sticky top-0 bg-[#E8F5E9] border-b border-[#8FCF9D] p-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <span className="bg-white p-1 rounded-full border border-green-200 w-8 h-8 flex items-center justify-center">
                  {categoryLabels[selectedSubsidy.category].icon}
                </span>
                <span className="text-sm">
                  {categoryLabels[selectedSubsidy.category].label.replace('\n', '')}
                </span>
              </div>
              <button
                onClick={() => setSelectedSubsidy(null)}
                className="p-1.5 bg-white hover:bg-slate-100 rounded-full text-slate-500 transition-colors shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* モーダルコンテンツ */}
            <div className="p-5 space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2 whitespace-pre-line">
                  {selectedSubsidy.title}
                </h2>
                <div className="inline-block bg-[#BBE3F5] text-slate-800 text-xs px-3 py-1 rounded-full font-bold mb-4">
                  {selectedSubsidy.shortDesc}
                </div>
                <div className="bg-[#F0F7F0] border border-[#8FCF9D] rounded-xl p-3 inline-block w-full">
                  <div className="text-xs text-slate-500 font-bold mb-1">補助金上限額</div>
                  <div className="text-3xl font-extrabold text-green-600 tracking-tight">
                    {selectedSubsidy.limit}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-2 text-base border-l-4 border-green-500 pl-3">
                  これってどんな補助金？
                </h3>
                <div className="text-slate-700 leading-relaxed text-sm text-left">
                  {selectedSubsidy.description}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <h3 className="flex items-center gap-2 font-bold text-green-800 mb-1 text-base">
                    <CheckCircle2 size={18} className="text-green-600" />
                    対象となる方
                  </h3>
                  <p className="text-slate-700 pl-6 text-sm">
                    {selectedSubsidy.target}
                  </p>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <h3 className="flex items-center gap-2 font-bold text-orange-800 mb-1 text-base">
                    <CheckCircle2 size={18} className="text-orange-500" />
                    ここがメリット！
                  </h3>
                  <p className="text-slate-700 pl-6 text-sm">
                    {selectedSubsidy.merit}
                  </p>
                </div>
              </div>
            </div>

            {/* モーダル下部アクション */}
            <div className="p-3 bg-[#F0F7F0] border-t border-[#8FCF9D] text-center">
              <button
                onClick={() => setSelectedSubsidy(null)}
                className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors active:scale-[0.98] shadow-lg shadow-green-200"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
