import NewsList from "../widgets/news/NewsList";
import EventList from "../widgets/event/EventList";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NewsList />
      <EventList />
    </div>
  );
}