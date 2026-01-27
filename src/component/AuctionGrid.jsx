import AuctionCard from "./AuctionCard";
function AuctionGrid({ items, onBid, userId, now }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
      }}
    >
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
