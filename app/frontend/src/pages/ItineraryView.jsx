import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { SkeuoCard, SkeuoButton, SkeuoBadge } from "@/components/Skeuo";
import { ArrowLeft, ArrowDown, Calendar, MapPin, Edit2, Backpack, BookOpen, FileText, DollarSign } from "lucide-react";

export default function ItineraryView() {
    const { id } = useParams();
    const [trip, setTrip] = useState(null);

    useEffect(() => { api.get(`/trips/${id}`).then((r) => setTrip(r.data)); }, [id]);
    if (!trip) return <div className="text-center text-sandy-700 py-20">Loading...</div>;

    return (
        <div className="space-y-6" data-testid="itinerary-view-page">
            <Link to="/trips" className="text-ocean-700 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> All trips</Link>

                <SkeuoCard className="!p-0 overflow-hidden">
                    <div className="relative h-64">
                        <img src={ trip.cover_image } alt={ trip.title } className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/85 via-ocean-700/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <SkeuoBadge tone="ocean" className="!bg-white/20 !text-white !shadow-none backdrop-blur capitalize">{trip.status}</SkeuoBadge>
                                        <h1 className="text-4xl font-bold text-white mt-2">{trip.title}</h1>
                                            <div className="text-ocean-100 mt-1 flex flex-wrap gap-4 text-sm">
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{trip.destination}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{trip.start_date} → {trip.end_date}</span>
                                                        <span className="font-bold">${trip.total_budget} total</span>
            </div>
          </div>
        </div>
      </SkeuoCard>

        <div className="flex flex-wrap gap-3">
            <Link to={`/trips/${id}/itinerary/edit`}> <SkeuoButton variant="secondary"><Edit2 className="w-4 h-4 inline mr-2" />Edit Itinerary</SkeuoButton></Link>
            <Link to={`/trips/${id}/packing`}> <SkeuoButton variant="secondary"><Backpack className="w-4 h-4 inline mr-2" />Packing</SkeuoButton></Link>
            <Link to={`/trips/${id}/notes`}> <SkeuoButton variant="secondary"><BookOpen className="w-4 h-4 inline mr-2" />Notes</SkeuoButton></Link>
            <Link to={`/trips/${id}/invoice`}> <SkeuoButton variant="secondary"><FileText className="w-4 h-4 inline mr-2" />Invoice</SkeuoButton></Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-sandy-900 mb-4">Itinerary for {trip.destination}</h2>
        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_140px] gap-4 px-2 mb-3 text-sm font-bold text-sandy-700 uppercase tracking-wide">
    <div> Day</div>
          <div>Physical Activity</div>
          <div className="text-right">Expense</div>
        </div>
    <div className="space-y-3">
{
    (trip.sections || []).map((s, idx) => (
        <div key={s.id} className="relative">
    <SkeuoCard className="grid grid-cols-1 md:grid-cols-[140px_1fr_140px] gap-4 items-center !p-5">
    <div>
    <SkeuoBadge tone="ocean">Day {idx + 1}</SkeuoBadge>
    <div className="text-xs text-sandy-700 mt-2">{s.date_from}</div>
                </div>
        <div className="space-y-2">
    <div className="font-bold text-sandy-900">{s.title}</div>
    <p className="text-sm text-sandy-700">{s.description}</p>
                  {(s.activities || []).length> 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
                      {
            s.activities.map((a, i) => <SkeuoBadge key={i} tone="sandy">{a}</SkeuoBadge>)}
                    </div>
                  )
        }
                </div>
        <div className="text-right">
    <div className="text-2xl font-bold text-ocean-700 flex items-center justify-end"><DollarSign className="w-5 h-5" />{s.budget}</div>
    <div className="text-xs text-sandy-700">{s.date_from} → {s.date_to}</div>
                </div>
              </SkeuoCard>
        { idx< (trip.sections.length - 1) && (
        <div className="flex justify-center py-2"><ArrowDown className="w-6 h-6 text-sandy-500" /></div>
              )
}
            </div>
          ))}
        </div>
    {(!trip.sections || trip.sections.length === 0) && (
        <SkeuoCard inset className="text-center text-sandy-700 py-12">No sections yet. <Link to={`/trips/${id}/itinerary/edit`} className="text-ocean-700 font-semibold">Add your first section.</Link></SkeuoCard>
        )}
      </div>
    </div>
  );
}
