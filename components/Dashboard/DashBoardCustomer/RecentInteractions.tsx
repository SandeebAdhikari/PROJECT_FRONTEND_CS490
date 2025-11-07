import React from "react";
import {
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Star,
  Clock,
} from "lucide-react";

interface Interaction {
  id: number;
  customerId: number;
  customerName: string;
  type: string;
  description: string;
  date: string;
  staff: string;
  rating: number | null;
  notes: string;
}

interface RecentInteractionsProps {
  interactions: Interaction[];
}

const RecentInteractions: React.FC<RecentInteractionsProps> = ({
  interactions,
}) => {
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-4 h-4" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4" />;
      case "complaint":
        return <AlertCircle className="w-4 h-4" />;
      case "rebooking":
        return <Clock className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-100 text-blue-600";
      case "feedback":
        return "bg-green-100 text-green-600";
      case "complaint":
        return "bg-red-100 text-red-600";
      case "rebooking":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="border border-border bg-secondary rounded-lg">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Recent Interactions & Feedback</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Latest customer activities and feedback
        </p>
      </div>

      <div className="divide-y divide-border">
        {interactions.map((interaction) => (
          <div
            key={interaction.id}
            className="p-4 hover:bg-accent transition-smooth"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`p-2 rounded-full ${getInteractionColor(
                  interaction.type
                )}`}
              >
                {getInteractionIcon(interaction.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">
                      {interaction.customerName}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {interaction.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getInteractionColor(
                      interaction.type
                    )}`}
                  >
                    {interaction.type}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{interaction.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Staff:</span>
                    <span>{interaction.staff}</span>
                  </div>
                  {interaction.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{interaction.rating}.0</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {interaction.notes && (
                  <div className="mt-2 p-2 bg-accent rounded text-xs">
                    <span className="font-medium">Notes:</span>{" "}
                    {interaction.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="p-4 border-t border-border text-center">
        <button className="text-sm text-primary-light font-semibold hover:underline">
          View All Interactions
        </button>
      </div>
    </div>
  );
};

export default RecentInteractions;
