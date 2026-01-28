import AuctionCard from "./AuctionCard";
function AuctionGrid({ items, onBid, userId, now }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <AuctionCard
          key={item.id}
          item={item}
          onBid={onBid}
          userId={userId}
          now={now}
        />
      ))}
    </div>
  );
}

export default AuctionGrid;
