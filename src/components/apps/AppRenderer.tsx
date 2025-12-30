'use client';

import React, { Suspense, lazy } from 'react';
import styles from './MiniApps.module.css';
import { Loader2 } from 'lucide-react';

const TodoListApp = lazy(() => import('./TodoListApp'));
const ExpenseTrackerApp = lazy(() => import('./ExpenseTrackerApp'));
const WeatherApp = lazy(() => import('./WeatherApp'));
const CryptoApp = lazy(() => import('./CryptoApp'));
const QuotesApp = lazy(() => import('./QuotesApp'));
const JokesApp = lazy(() => import('./JokesApp'));
const CountriesApp = lazy(() => import('./CountriesApp'));
const CalculatorApp = lazy(() => import('./CalculatorApp'));
const QRCodeApp = lazy(() => import('./QRCodeApp'));
const PokemonApp = lazy(() => import('./PokemonApp'));
const CurrencyApp = lazy(() => import('./CurrencyApp'));
const DogGalleryApp = lazy(() => import('./DogGalleryApp'));
const CatFactsApp = lazy(() => import('./CatFactsApp'));
const AdviceApp = lazy(() => import('./AdviceApp'));
const BoredApp = lazy(() => import('./BoredApp'));
const DictionaryApp = lazy(() => import('./DictionaryApp'));
const GitHubApp = lazy(() => import('./GitHubApp'));
const IPInfoApp = lazy(() => import('./IPInfoApp'));
const NotesApp = lazy(() => import('./NotesApp'));
const TriviaApp = lazy(() => import('./TriviaApp'));
const ColorsApp = lazy(() => import('./ColorsApp'));
const TimerApp = lazy(() => import('./TimerApp'));
const PomodoroApp = lazy(() => import('./PomodoroApp'));
const UnitConverterApp = lazy(() => import('./UnitConverterApp'));
const N8nApp = lazy(() => import('./N8nApp'));
const TextToolsApp = lazy(() => import('./TextToolsApp'));
const PasswordGeneratorApp = lazy(() => import('./PasswordGeneratorApp'));
const DateCalculatorApp = lazy(() => import('./DateCalculatorApp'));
const JsonFormatterApp = lazy(() => import('./JsonFormatterApp'));
const Base64App = lazy(() => import('./Base64App'));
const LoremIpsumApp = lazy(() => import('./LoremIpsumApp'));
const RegexTesterApp = lazy(() => import('./RegexTesterApp'));
const EmojiPickerApp = lazy(() => import('./EmojiPickerApp'));
const MarkdownPreviewApp = lazy(() => import('./MarkdownPreviewApp'));
const UUIDGeneratorApp = lazy(() => import('./UUIDGeneratorApp'));
const GradientGeneratorApp = lazy(() => import('./GradientGeneratorApp'));
const CountdownApp = lazy(() => import('./CountdownApp'));
const RandomNumberApp = lazy(() => import('./RandomNumberApp'));
const PercentageApp = lazy(() => import('./PercentageApp'));
const WorldClockApp = lazy(() => import('./WorldClockApp'));
const AspectRatioApp = lazy(() => import('./AspectRatioApp'));
const NumberBaseApp = lazy(() => import('./NumberBaseApp'));
const TranslatorApp = lazy(() => import('./TranslatorApp'));
const WordCounterApp = lazy(() => import('./WordCounterApp'));
const AgeCalculatorApp = lazy(() => import('./AgeCalculatorApp'));
const BMICalculatorApp = lazy(() => import('./BMICalculatorApp'));
const UrlShortenerApp = lazy(() => import('./UrlShortenerApp'));
const ImageConverterApp = lazy(() => import('./ImageConverterApp'));
const PDFToolsApp = lazy(() => import('./PDFToolsApp'));
const DocumentConverterApp = lazy(() => import('./DocumentConverterApp'));
const AudioConverterApp = lazy(() => import('./AudioConverterApp'));
const VideoConverterApp = lazy(() => import('./VideoConverterApp'));
const TextToSpeechApp = lazy(() => import('./TextToSpeechApp'));
const HashGeneratorApp = lazy(() => import('./HashGeneratorApp'));
const SpeechToTextApp = lazy(() => import('./SpeechToTextApp'));
const ImageResizerApp = lazy(() => import('./ImageResizerApp'));
const ImageCompressorApp = lazy(() => import('./ImageCompressorApp'));
const LoanCalculatorApp = lazy(() => import('./LoanCalculatorApp'));
const DiscountCalculatorApp = lazy(() => import('./DiscountCalculatorApp'));
const TipCalculatorApp = lazy(() => import('./TipCalculatorApp'));
const InvoiceGeneratorApp = lazy(() => import('./InvoiceGeneratorApp'));
const FlashcardApp = lazy(() => import('./FlashcardApp'));
const HabitTrackerApp = lazy(() => import('./HabitTrackerApp'));
const MorseCodeApp = lazy(() => import('./MorseCodeApp'));
const ColorBlindnessApp = lazy(() => import('./ColorBlindnessApp'));
const NasaApodApp = lazy(() => import('./NasaApodApp'));
const BreathingApp = lazy(() => import('./BreathingApp'));
const StopwatchApp = lazy(() => import('./StopwatchApp'));
const CoinFlipApp = lazy(() => import('./CoinFlipApp'));
const DecisionWheelApp = lazy(() => import('./DecisionWheelApp'));
const RockPaperScissorsApp = lazy(() => import('./RockPaperScissorsApp'));
const Magic8BallApp = lazy(() => import('./Magic8BallApp'));
const TypingSpeedApp = lazy(() => import('./TypingSpeedApp'));
const CaseConverterApp = lazy(() => import('./CaseConverterApp'));
const TicTacToeApp = lazy(() => import('./TicTacToeApp'));
const RandomColorApp = lazy(() => import('./RandomColorApp'));
const DiceRollerApp = lazy(() => import('./DiceRollerApp'));
const ReactionTimeApp = lazy(() => import('./ReactionTimeApp'));
const SquareRootApp = lazy(() => import('./SquareRootApp'));
const FactorialApp = lazy(() => import('./FactorialApp'));
const BinaryCalculatorApp = lazy(() => import('./BinaryCalculatorApp'));
const HexCalculatorApp = lazy(() => import('./HexCalculatorApp'));
const AreaCalculatorApp = lazy(() => import('./AreaCalculatorApp'));
const StatisticsApp = lazy(() => import('./StatisticsApp'));
const FractionApp = lazy(() => import('./FractionApp'));
const FakeDataApp = lazy(() => import('./FakeDataApp'));
const TemperatureApp = lazy(() => import('./TemperatureApp'));
const PowerCalculatorApp = lazy(() => import('./PowerCalculatorApp'));
const RomanNumeralApp = lazy(() => import('./RomanNumeralApp'));
const SpeedConverterApp = lazy(() => import('./SpeedConverterApp'));
const PalindromeApp = lazy(() => import('./PalindromeApp'));
const PrimeNumberApp = lazy(() => import('./PrimeNumberApp'));
const LeapYearApp = lazy(() => import('./LeapYearApp'));
const NumberGuessingApp = lazy(() => import('./NumberGuessingApp'));
const WordScrambleApp = lazy(() => import('./WordScrambleApp'));
const CharacterCounterApp = lazy(() => import('./CharacterCounterApp'));
const DataSizeApp = lazy(() => import('./DataSizeApp'));
const DiscountApp = lazy(() => import('./DiscountApp'));
const TextReverserApp = lazy(() => import('./TextReverserApp'));
const URLEncoderApp = lazy(() => import('./URLEncoderApp'));
const HTMLEntityApp = lazy(() => import('./HTMLEntityApp'));
const AlarmApp = lazy(() => import('./AlarmApp'));
const CreditCardApp = lazy(() => import('./CreditCardApp'));
const TextDiffApp = lazy(() => import('./TextDiffApp'));
const BarcodeApp = lazy(() => import('./BarcodeApp'));
const IBANValidatorApp = lazy(() => import('./IBANValidatorApp'));
const RandomNameApp = lazy(() => import('./RandomNameApp'));
const IPCalculatorApp = lazy(() => import('./IPCalculatorApp'));


const appComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
    TodoListApp,
    ExpenseTrackerApp,
    WeatherApp,
    CryptoApp,
    QuotesApp,
    JokesApp,
    CountriesApp,
    CalculatorApp,
    QRCodeApp,
    PokemonApp,
    CurrencyApp,
    DogGalleryApp,
    CatFactsApp,
    AdviceApp,
    BoredApp,
    DictionaryApp,
    GitHubApp,
    IPInfoApp,
    NotesApp,
    TriviaApp,
    ColorsApp,
    TimerApp,
    PomodoroApp,
    UnitConverterApp,
    N8nApp,
    TextToolsApp,
    PasswordGeneratorApp,
    DateCalculatorApp,
    JsonFormatterApp,
    Base64App,
    LoremIpsumApp,
    RegexTesterApp,
    EmojiPickerApp,
    MarkdownPreviewApp,
    UUIDGeneratorApp,
    GradientGeneratorApp,
    CountdownApp,
    RandomNumberApp,
    PercentageApp,
    WorldClockApp,
    AspectRatioApp,
    NumberBaseApp,
    TranslatorApp,
    WordCounterApp,
    AgeCalculatorApp,
    BMICalculatorApp,
    UrlShortenerApp,
    ImageConverterApp,
    PDFToolsApp,
    DocumentConverterApp,
    AudioConverterApp,
    VideoConverterApp,
    TextToSpeechApp,
    HashGeneratorApp,
    SpeechToTextApp,
    ImageResizerApp,
    ImageCompressorApp,
    LoanCalculatorApp,
    DiscountCalculatorApp,
    TipCalculatorApp,
    InvoiceGeneratorApp,
    FlashcardApp,
    HabitTrackerApp,
    MorseCodeApp,
    ColorBlindnessApp,
    NasaApodApp,
    BreathingApp,
    StopwatchApp,
    CoinFlipApp,
    DecisionWheelApp,
    RockPaperScissorsApp,
    Magic8BallApp,
    TypingSpeedApp,
    CaseConverterApp,
    TicTacToeApp,
    RandomColorApp,
    DiceRollerApp,
    ReactionTimeApp,
    SquareRootApp,
    FactorialApp,
    BinaryCalculatorApp,
    HexCalculatorApp,
    AreaCalculatorApp,
    StatisticsApp,
    FractionApp,
    FakeDataApp,
    TemperatureApp,
    PowerCalculatorApp,
    RomanNumeralApp,
    SpeedConverterApp,
    PalindromeApp,
    PrimeNumberApp,
    LeapYearApp,
    NumberGuessingApp,
    WordScrambleApp,
    CharacterCounterApp,
    DataSizeApp,
    DiscountApp,
    TextReverserApp,
    URLEncoderApp,
    HTMLEntityApp,
    AlarmApp,
    CreditCardApp,
    TextDiffApp,
    BarcodeApp,
    IBANValidatorApp,
    RandomNameApp,
    IPCalculatorApp,
};

function LoadingFallback() {
    return (
        <div className={styles.loading}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <p>Loading...</p>
        </div>
    );
}

interface AppRendererProps {
    componentName: string;
}

export default function AppRenderer({ componentName }: AppRendererProps) {
    const Component = appComponents[componentName];

    if (!Component) {
        return (
            <div className={styles.error}>
                <p>App not found</p>
            </div>
        );
    }

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Component />
        </Suspense>
    );
}
