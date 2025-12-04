import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Users, Heart, Home, Hammer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  totalFamilies: number;
  totalDonors: number;
  totalVolunteers: number;
}

export function StatsSection() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all stats concurrently
        const [
          { count: familiesCount, error: familiesError },
          { count: donorsCount, error: donorsError },
          { count: volunteersCount, error: volunteersError },
        ] = await Promise.all([
          supabase.from('victims').select('*', { count: 'exact', head: true }),
          supabase.from('donors').select('*', { count: 'exact', head: true }),
          supabase.from('volunteers').select('*', { count: 'exact', head: true }),
        ]);

        if (familiesError || donorsError || volunteersError) {
          throw new Error('Failed to fetch statistics');
        }

        setStats({
          totalFamilies: familiesCount || 0,
          totalDonors: donorsCount || 0,
          totalVolunteers: volunteersCount || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
        
        // Set fallback values for demo
        setStats({
          totalFamilies: 0,
          totalDonors: 0,
          totalVolunteers: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscription for victims table
    const victimsSubscription = supabase
      .channel('victims-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'victims' }, 
        () => fetchStats()
      )
      .subscribe();

    // Set up real-time subscription for donors table
    const donorsSubscription = supabase
      .channel('donors-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donors' }, 
        () => fetchStats()
      )
      .subscribe();

    // Set up real-time subscription for volunteers table
    const volunteersSubscription = supabase
      .channel('volunteers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'volunteers' }, 
        () => fetchStats()
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      victimsSubscription.unsubscribe();
      donorsSubscription.unsubscribe();
      volunteersSubscription.unsubscribe();
    };
  }, []);

  const statItems = [
    {
      title: t("stats.familiesHelped"),
      value: stats?.totalFamilies || 0,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      title: t("stats.volunteersActive"),
      value: stats?.totalVolunteers || 0,
      icon: Hammer,
      color: "bg-green-500/10 text-green-600",
      iconColor: "text-green-600",
    },
    {
      title: t("stats.donorsContributed"),
      value: stats?.totalDonors || 0,
      icon: Heart,
      color: "bg-orange-500/10 text-orange-600",
      iconColor: "text-orange-600",
    },
    {
      title: t("stats.areasServed"),
      value: 0,
      icon: Home,
      color: "bg-purple-500/10 text-purple-600",
      iconColor: "text-purple-600",
    },
  ];

  if (error && !stats) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-8 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            {t("howItWorks.title")}
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.title}
                  className="border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      {/* Icon Background */}
                      <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${item.color}`}>
                        <Icon className={`h-10 w-10 ${item.iconColor}`} />
                      </div>
                      
                      {/* Value */}
                      {loading ? (
                        <Skeleton className="h-12 w-24 mb-2" />
                      ) : (
                        <div className="mb-2 text-4xl font-bold text-foreground">
                          {item.value.toLocaleString()}
                          <span className="ml-1 text-xl text-primary">+</span>
                        </div>
                      )}
                      
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-muted-foreground">
                        {item.title}
                      </h3>
                      
                      {/* Loading Skeleton */}
                      {loading && (
                        <Skeleton className="mt-2 h-4 w-32" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {stats && (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                Statistics update in real-time as new registrations come in
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
