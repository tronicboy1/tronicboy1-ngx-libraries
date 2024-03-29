import { Observable } from 'rxjs';
import { Member } from './member-factory';

export abstract class AbstractMemberService {
  protected rootKey = 'members';

  abstract create$(data: Member): Observable<string>;

  abstract delete$(id: string): Observable<void>;

  abstract addMemberAccount$(groupId: string, memberId: string, memberUid: string): Observable<void>;

  abstract update$(id: string, data: Partial<Member>): Observable<void>;

  abstract get$(id: string): Observable<Member>;

  abstract getGroupMembers$(groupId: string): Observable<Member[]>;
}
