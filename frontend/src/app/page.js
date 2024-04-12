import Features from "@/components/landingPage/features";
import Footer from "@/components/landingPage/footer";
import Header from "@/components/landingPage/header";
import Trade from "@/components/landingPage/trade";

export default function MainPage() {
    return (
      <div className="overflow-x-hidden">
        <Header />
        <Features />
        <Trade />
        <Footer />
      </div>
    )
}