import { paths } from "../layout/Layout";

export const SidebarIcons = ({
  isActive,
  path,
}: {
  isActive: boolean;
  path: paths;
}) => {
  // if (path === '/') {
  //   return <CheckSvg isActive={isActive} />;
  // } else if (path === '/add-durian') {
  //   return <AddDurianSvg isActive={isActive} />;
  // } else if (path === '/catalog') {
  //   return <CatalogSvg isActive={isActive} />;
  // } else if (path === '/stock-in') {
  //   return <StockInSvg isActive={isActive} />;
  // } else if (path === '/sell') {
  //   return <SellSvg isActive={isActive} />;
  // } else if (path === '/add-consumer') {
  //   return <AddConsumerSvg isActive={isActive} />;
  // } else if (path === '/rate') {
  //   return <RateSvg isActive={isActive} />;
  // } else if (path === '/add-account') {
  //   return <AddAccountSvg isActive={isActive} />;
  // } else if (path === '/view-accounts') {
  //   return <ViewAccountsSvg isActive={isActive} />;
  // } else {
  //   return <></>;
  // }
  if (path === "/") {
    return <CheckVotingSessionSvg isActive={isActive} />;
  } else if (path === "/add-voting-session") {
    return <AddVotingSessionSvg isActive={isActive} />;
  } else if (path === "/register-voter-candidate") {
    return <RegisterVoterCandidateSvg isActive={isActive} />;
  } else if (path === "/update-voting-phase") {
    return <UpdateVotingPhaseSvg isActive={isActive} />;
  } else if (path === "/add-account") {
    return <AddAccountSvg isActive={isActive} />;
  } else if (path === "/view-accounts") {
    return <ViewAccountsSvg isActive={isActive} />;
  } else if (path === "/my-voting-sessions") {
    return <MyVotingSessionsSvg isActive={isActive} />;
  } else if (path === "/cast-vote") {
    return <CastVoteSvg isActive={isActive} />;
  } else {
    return <></>;
  }
};

const CheckVotingSessionSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M80 856v-60h400v60H80Zm0-210v-60h200v60H80Zm0-210v-60h200v60H80Zm758 420L678 696q-26 20-56 30t-62 10q-83 0-141.5-58.5T360 536q0-83 58.5-141.5T560 336q83 0 141.5 58.5T760 536q0 32-10 62t-30 56l160 160-42 42ZM559.765 676Q618 676 659 635.235q41-40.764 41-99Q700 478 659.235 437q-40.764-41-99-41Q502 396 461 436.765q-41 40.764-41 99Q420 594 460.765 635q40.764 41 99 41Z"
      />
    </svg>
  );
};

const AddVotingSessionSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M120 726v-60h300v60H120Zm0-165v-60h470v60H120Zm0-165v-60h470v60H120Zm530 500V726H480v-60h170V496h60v170h170v60H710v170h-60Z"
      />
    </svg>
  );
};

const RegisterVoterCandidateSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M140 976q-24 0-42-18t-18-42V436q0-24 18-42t42-18h250V236q0-24 18-42t42.411-18h59.178Q534 176 552 194t18 42v140h250q24 0 42 18t18 42v480q0 24-18 42t-42 18H140Zm0-60h680V436H570v30q0 28-18 44t-42.411 16h-59.178Q426 526 408 510t-18-44v-30H140v480Zm92-107h239v-14q0-18-9-32t-23-19q-32-11-50-14.5t-35-3.5q-19 0-40.5 4.5T265 744q-15 5-24 19t-9 32v14Zm336-67h170v-50H568v50Zm-214-50q22.5 0 38.25-15.75T408 638q0-22.5-15.75-38.25T354 584q-22.5 0-38.25 15.75T300 638q0 22.5 15.75 38.25T354 692Zm214-63h170v-50H568v50ZM450 466h60V236h-60v230Zm30 210Z"
      />
    </svg>
  );
};

const UpdateVotingPhaseSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M430 974q-72-9-134.5-43t-108-86.5Q142 792 116 723.5T90 576q0-88 41.5-168T243 266H121v-60h229v229h-60V306q-64 51-102 121.5T150 576q0 132 80 225.5T430 913v61Zm-7-228L268 591l42-42 113 113 227-227 42 42-269 269Zm187 200V717h60v129q64-52 102-122t38-148q0-132-80-225.5T530 239v-61q146 18 243 129t97 269q0 88-41.5 168T717 886h122v60H610Z"
      />
    </svg>
  );
};

const AddAccountSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M730 656V526H600v-60h130V336h60v130h130v60H790v130h-60Zm-370-81q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM40 896v-94q0-35 17.5-63.5T108 696q75-33 133.338-46.5 58.339-13.5 118.5-13.5Q420 636 478 649.5 536 663 611 696q33 15 51 43t18 63v94H40Zm60-60h520v-34q0-16-9-30.5T587 750q-71-33-120-43.5T360 696q-58 0-107.5 10.5T132 750q-15 7-23.5 21.5T100 802v34Zm260-321q39 0 64.5-25.5T450 425q0-39-25.5-64.5T360 335q-39 0-64.5 25.5T270 425q0 39 25.5 64.5T360 515Zm0-90Zm0 411Z"
      />
    </svg>
  );
};

const ViewAccountsSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M38 896v-94q0-35 18-63.5t50-42.5q73-32 131.5-46T358 636q62 0 120 14t131 46q32 14 50.5 42.5T678 802v94H38Zm700 0v-94q0-63-32-103.5T622 633q69 8 130 23.5t99 35.5q33 19 52 47t19 63v94H738ZM358 575q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42Zm360-150q0 66-42 108t-108 42q-11 0-24.5-1.5T519 568q24-25 36.5-61.5T568 425q0-45-12.5-79.5T519 282q11-3 24.5-5t24.5-2q66 0 108 42t42 108ZM98 836h520v-34q0-16-9.5-31T585 750q-72-32-121-43t-106-11q-57 0-106.5 11T130 750q-14 6-23 21t-9 31v34Zm260-321q39 0 64.5-25.5T448 425q0-39-25.5-64.5T358 335q-39 0-64.5 25.5T268 425q0 39 25.5 64.5T358 515Zm0 321Zm0-411Z"
      />
    </svg>
  );
};

const MyVotingSessionsSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M350 836h470V699H350v137ZM140 453h150V316H140v137Zm0 187h150V513H140v127Zm0 196h150V699H140v137Zm210-196h470V513H350v127Zm0-187h470V316H350v137ZM140 896q-24 0-42-18t-18-42V316q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H140Z"
      />
    </svg>
  );
};

const CastVoteSvg = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={"w-6 h-6" + (isActive ? " text-primary" : " text-gray-500")}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M180 976q-24 0-42-18t-18-42V718l135-149 43 43-118 129h600L669 615l43-43 128 146v198q0 24-18 42t-42 18H180Zm0-60h600V801H180v115Zm262-245L283 512q-19-19-17-42.5t20-41.5l212-212q16.934-16.56 41.967-17.28Q565 198 583 216l159 159q17 17 17.5 40.5T740 459L528 671q-17 17-42 18t-44-18Zm249-257L541 264 333 472l150 150 208-208ZM180 916V801v115Z"
      />
    </svg>
  );
};
