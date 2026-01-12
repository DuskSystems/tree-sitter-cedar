// https://github.com/cedar-policy/rfcs/pull/98

template(?user: User, ?dept: Department) =>
  permit(principal == ?user, action, resource in ?dept);

template(?minLevel: Long) =>
  permit(principal, action, resource)
  when { principal.level >= ?minLevel };

template(?allowed: Set<Action>) =>
  permit(principal, action in ?allowed, resource);
