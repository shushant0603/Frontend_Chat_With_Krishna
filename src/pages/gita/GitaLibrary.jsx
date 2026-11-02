import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiUrl } from '../../config/api'
import './gita.css'

const chapterNames = [
  'अर्जुनविषादयोग', 'सांख्ययोग', 'कर्मयोग', 'ज्ञानकर्मसंन्यासयोग',
  'कर्मसंन्यासयोग', 'ध्यानयोग', 'ज्ञानविज्ञानयोग', 'अक्षरब्रह्मयोग',
  'राजविद्याराजगुह्ययोग', 'विभूतियोग', 'विश्वरूपदर्शनयोग', 'भक्तियोग',
  'क्षेत्रक्षेत्रज्ञविभागयोग', 'गुणत्रयविभागयोग', 'पुरुषोत्तमयोग',
  'दैवासुरसम्पद्विभागयोग', 'श्रद्धात्रयविभागयोग', 'मोक्षसंन्यासयोग',
]

function GitaLibrary() {
  const navigate = useNavigate()
  const [verses, setVerses] = useState([])
  const [chapter, setChapter] = useState('all')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [language, setLanguage] = useState('hi')
  const [loadError, setLoadError] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [audioPlayer, setAudioPlayer] = useState(null)
  const audioRef = useRef(null)
  const musicRef = useRef(null)

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      URL.revokeObjectURL(audioRef.current.src)
    }
    musicRef.current?.pause()
  }, [])

  useEffect(() => {
    fetch('/data/gita.json')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load Gita verses')
        return response.json()
      })
      .then(setVerses)
      .catch(() => setLoadError(true))
  }, [])

  const chapters = useMemo(() => [...new Set(verses.map((verse) => verse.Chapter))], [verses])
  const filteredVerses = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return verses.filter((verse) => {
      const matchesChapter = chapter === 'all' || verse.Chapter === chapter
      return matchesChapter && (!normalizedQuery || [verse.Shloka, verse.Transliteration, verse.HinMeaning, verse.EngMeaning, verse.WordMeaning, verse.ID].some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)))
    })
  }, [verses, chapter, query])

  const openVerse = (verse) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    audioPlayer?.pause()
    musicRef.current?.pause()
    if (audioPlayer) URL.revokeObjectURL(audioPlayer.src)
    audioRef.current = null
    setAudioPlayer(null)
    setIsSpeaking(false)
    setSelected(verse)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const nextVerse = verses.find((verse) => verse.Chapter === selected?.Chapter && Number(verse.Verse) === Number(selected?.Verse) + 1)
  const chapterVerseCount = verses.filter((verse) => verse.Chapter === selected?.Chapter).length
  const readingProgress = chapterVerseCount ? (Number(selected?.Verse) / chapterVerseCount) * 100 : 0

  const goToNextVerse = () => {
    if (nextVerse) openVerse(nextVerse)
  }

  const toggleShlokaAudio = () => {
    if (isAudioLoading) return
    if (isSpeaking && audioPlayer) {
      audioPlayer.pause()
      musicRef.current?.pause()
      URL.revokeObjectURL(audioPlayer.src)
      audioRef.current = null
      audioPlayer.currentTime = 0
      setIsSpeaking(false)
      setAudioPlayer(null)
      return
    }
    setIsAudioLoading(true)
    const spokenShloka = selected.Shloka
      .replace(/\s*\|\|[^|]*\|\|\s*$/u, '')
      .replace(/(उवाच)\s*\|/u, '$1।')
      .replace(/[|॥]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    const spokenMeaning = (selected.HinMeaning || '')
      .replace(/^\s*।{1,2}\s*[\d०-९.\-–]+\s*।{1,2}\s*/u, '')
      .trim()
    const speechText = spokenMeaning
      ? `${spokenShloka} । अब इस श्लोक का अर्थ सुनिए। ${spokenMeaning}`
      : spokenShloka
    fetch(apiUrl('/tts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: speechText,
        rate: '-12%',
        pitch: '-4Hz',
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Audio generation failed')
        return response.blob()
      })
      .then((audioBlob) => {
        const player = new Audio(URL.createObjectURL(audioBlob))
        audioRef.current = player
        setAudioPlayer(player)
        player.onended = () => {
          musicRef.current?.pause()
          URL.revokeObjectURL(player.src)
          setAudioPlayer(null)
          audioRef.current = null
          setIsSpeaking(false)
        }
        player.onerror = () => {
          musicRef.current?.pause()
          URL.revokeObjectURL(player.src)
          setAudioPlayer(null)
          audioRef.current = null
          setIsSpeaking(false)
        }
        return player.play().then(async () => {
          setIsSpeaking(true)
          const music = musicRef.current
          if (music) {
            music.volume = 0.08
            music.currentTime = 0
            await music.play().catch(() => {})
          }
        })
      })
      .catch(() => {
        if (audioRef.current) {
          audioRef.current.pause()
          URL.revokeObjectURL(audioRef.current.src)
          audioRef.current = null
        }
        musicRef.current?.pause()
        setAudioPlayer(null)
        setIsSpeaking(false)
        window.alert('श्लोक की आवाज़ नहीं चल पाई। जाँचें कि backend चालू है।')
      })
      .finally(() => setIsAudioLoading(false))
  }

  return (
    <main className="gita-page">
      <header className="gita-header">
        <button className="gita-back" onClick={() => navigate('/')} aria-label="वापस जाएँ">← <span>मुखपृष्ठ</span></button>
        <div className="gita-brand">श्रीमद्भगवद्गीता</div>
        <div className="gita-actions"><a className="gita-pdf-link" href="/documents/gita.pdf" target="_blank" rel="noreferrer">मूल PDF ↗</a><button className="gita-chat" onClick={() => navigate('/chat')}>कृष्ण से पूछें <span>💬</span></button></div>
      </header>

      {!selected && <section className="gita-intro">
        <span className="gita-eyebrow">श्रीमद्भगवद्गीता · १८ अध्याय · {verses.length || 701} श्लोक</span>
        <h1>गीता का ज्ञान,<br /><em>आपके साथ।</em></h1>
        <p>हर श्लोक को पढ़ें, उसका अर्थ समझें और उसके संदेश को अपने जीवन से जोड़ें।</p>
        <div className="gita-search-wrap">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="श्लोक, शब्द या अर्थ खोजें…" aria-label="श्लोक खोजें" />
          {query && <button onClick={() => setQuery('')} aria-label="खोज साफ़ करें">×</button>}
        </div>
      </section>}

      {selected ? (
        <section className="verse-detail kindle-reader" aria-live="polite">
          <audio ref={musicRef} src="/audio.mp3" loop preload="none" />
          <div className="reader-toolbar">
            <button className="detail-back" onClick={() => { audioPlayer?.pause(); if (audioPlayer) URL.revokeObjectURL(audioPlayer.src); musicRef.current?.pause(); audioRef.current = null; setAudioPlayer(null); setIsSpeaking(false); setSelected(null) }}>← पुस्तकालय</button>
            <span className="reader-location">{selected.Verse} / {chapterVerseCount} श्लोक</span>
            <button className="reader-next" onClick={goToNextVerse} disabled={!nextVerse}>अगला <span aria-hidden="true">→</span></button>
          </div>
          <div className="reader-progress"><span style={{ width: `${readingProgress}%` }} /></div>
          <article className="reader-page">
            <header className="reader-chapter-heading">
              <span>अध्याय {selected.Chapter}</span>
              <h1>{chapterNames[Number(selected.Chapter) - 1]}</h1>
              <small>श्लोक {selected.Verse}</small>
            </header>
            <div className="reader-divider"><span>❧</span></div>
            <div className="reader-verse-column">
              <h2 className="detail-shloka">{selected.Shloka}</h2>
              <p className="detail-transliteration">{selected.Transliteration}</p>
              <div className="shloka-audio-wrap">
                <button className="shloka-audio" onClick={toggleShlokaAudio} disabled={isAudioLoading} aria-label={isSpeaking ? 'श्लोक सुनना रोकें' : 'श्लोक सुनें'}>{isAudioLoading ? 'आवाज़ तैयार हो रही है…' : isSpeaking ? '⏹ सुनना रोकें' : '▶ श्लोक और अर्थ सुनें'}</button>
              </div>
            </div>
            <section className="reader-meaning">
              <div className="reader-meaning-heading">
                <span>{language === 'hi' ? 'भावार्थ' : 'Meaning'}</span>
                <div className="meaning-toggle" role="group" aria-label="अर्थ की भाषा">
                  <button className={language === 'hi' ? 'active' : ''} onClick={() => setLanguage('hi')}>हिंदी</button>
                  <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>English</button>
                </div>
              </div>
              <p>{language === 'hi' ? selected.HinMeaning : selected.EngMeaning}</p>
            </section>
            {selected.WordMeaning && <details className="reader-notes"><summary>शब्दार्थ एवं टिप्पणी</summary><p>{selected.WordMeaning}</p></details>}
          </article>
        </section>
      ) : (
        <section className="gita-library">
          <div className="chapter-heading"><div><span className="section-kicker">पाठ चुनें</span><h2>अध्याय और श्लोक</h2></div><span className="verse-count">{filteredVerses.length} श्लोक</span></div>
          <div className="chapter-strip" aria-label="अध्याय चुनें">
            <button className={chapter === 'all' ? 'selected' : ''} onClick={() => setChapter('all')}>सभी अध्याय</button>
            {chapters.map((number) => <button key={number} className={chapter === number ? 'selected' : ''} onClick={() => setChapter(number)}><span>{number.padStart(2, '0')}</span>{chapterNames[Number(number) - 1]}</button>)}
          </div>
          {loadError ? <p className="empty-state">श्लोक लोड नहीं हो पाए। कृपया पेज रीफ़्रेश करें।</p> : filteredVerses.length ? (
            <div className="verse-grid">
              {filteredVerses.map((verse) => <button className="verse-card" key={verse.ID} onClick={() => openVerse(verse)}>
                <span className="verse-meta">अध्याय {verse.Chapter} <i>·</i> श्लोक {verse.Verse}</span>
                <span className="verse-text">{verse.Shloka}</span>
                <span className="verse-meaning">{verse.HinMeaning}</span>
                <span className="verse-open">अर्थ पढ़ें <span>↗</span></span>
              </button>)}
            </div>
          ) : <p className="empty-state">इस खोज से कोई श्लोक नहीं मिला। दूसरे शब्द से खोजें।</p>}
        </section>
      )}
      {!selected && <footer className="gita-footer">॥ यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ॥</footer>}
    </main>
  )
}

export default GitaLibrary
