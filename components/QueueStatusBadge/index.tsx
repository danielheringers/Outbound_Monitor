import CTEOSStatusBadge from "./CTEOSStatusBadge";
import NFEStatusBadge from "./NFEStatusBadge";

export default function QueueStatusBadges() {
  return (
    <div className="flex flex-wrap md:justify-center lg:justify-end gap-2">
      <NFEStatusBadge />
      <CTEOSStatusBadge />
    </div>
  );
}
