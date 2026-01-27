import AuctionCard from "./AuctionCard";
function AuctionGrid({ items, onBid, userId }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
      }}
    >
      {items.map((item) => (
        <AuctionCard key={item.id} item={item} onBid={onBid} userId={userId} />
      ))}
    </div>
  );
}

export default AuctionGrid;
