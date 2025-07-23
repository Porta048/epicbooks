import { createFileRoute } from '@tanstack/react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyNav from '../components/MyNav';
import MyFooter from '../components/MyFooter';
import Welcome from '../components/Welcome';
import BookList from '../components/BookList';
import booksData from '../assets/fantasy.json';

export const Route = createFileRoute('/')({  
  component: App,
});

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <MyNav />
      <main className="flex-grow-1">
        <Welcome />
        <BookList books={booksData} />
      </main>
      <MyFooter />
    </div>
  );
}
