import { memo } from "react";
import AuctionCard from "./AuctionCard";

const AuctionGrid = memo(function AuctionGrid({ items, onBid, userId }) {
  console.log("rendered");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item) => (
        <AuctionCard key={item.id} item={item} onBid={onBid} userId={userId} />
      ))}
    </div>
  );
});

export default AuctionGrid;
