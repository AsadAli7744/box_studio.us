import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { RequestProvider } from './context/RequestContext';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import BoxesPage from './pages/BoxesPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductPage from './pages/ProductPage';
import QuotePage from './pages/QuotePage';
import { getOffering, getShopCategory, legacyCategoryPath, legacyProductPath, legacyUsePath } from './data/offerings';

function EntryPage() {
  const { slug } = useParams();
  if (getOffering(slug)) return <ProductPage />;
  if (getShopCategory(slug)) return <BoxesPage categorySlug={slug} />;
  return <NotFoundPage />;
}

function LegacyCategoryRedirect() {
  const { categorySlug } = useParams();
  return <Navigate to={legacyCategoryPath(categorySlug)} replace />;
}

function LegacyProductRedirect() {
  const { productSlug } = useParams();
  return <Navigate to={legacyProductPath(productSlug)} replace />;
}

function LegacyUseRedirect() {
  const { useSlug } = useParams();
  return <Navigate to={legacyUsePath(useSlug)} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <RequestProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="custom-boxes" element={<BoxesPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="quote" element={<QuotePage />} />
            <Route path="boxes" element={<Navigate to="/custom-boxes" replace />} />
            <Route path="boxes/:categorySlug" element={<LegacyCategoryRedirect />} />
            <Route path="products/:productSlug" element={<LegacyProductRedirect />} />
            <Route path="uses/:useSlug" element={<LegacyUseRedirect />} />
            <Route path=":slug" element={<EntryPage />} />
          </Route>
        </Routes>
      </RequestProvider>
    </BrowserRouter>
  );
}
