import NewTeam from '../__components/NewTeam';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Card } from '@/components/ui/card';
import { TypographyH4 } from '@/components/ui/Typography';
import dayjs from 'dayjs';
import Team from '../__components/Team';

const Teams = () => {
  const { user } = useUser();
  const allUserTeams = useQuery(api.teams.getUserTeams, {
    email: user?.primaryEmailAddress?.emailAddress || '',
  });

  return (
    <Card className='p-10 flex flex-col flex-wrap justify-center items-center gap-4'>
      {allUserTeams ? (
        <>
          <NewTeam btnText='New Team' />
          <div className='grid grid-col-2 md:grid-cols-3 gap-4 w-full'>
            {allUserTeams?.map((team, index) => (
              <Team
                key={index}
                team={{
                  id: team._id,
                  name: team.name,
                  createdOn: dayjs(team._creationTime).format('DD-MM-YYYY'),
                }}
              />
            ))}
          </div>
        </>
      ) : null}
      {!allUserTeams ? (
        <>
          <TypographyH4 text="Looks like you haven't created team" />
          <NewTeam btnText='Create New Team' />
        </>
      ) : null}
    </Card>
  );
};
export default Teams;
